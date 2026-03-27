package game

import (
	"fmt"
	"log"
	"math/rand"

	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/mapdata"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/skills"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
)

// handleSpellCast handles a spell cast request from a player.
func (e *Engine) handleSpellCast(client *network.Client, req *pb.SpellCastRequest) {
	p := e.getPlayerByClient(client)
	if p == nil || p.HP <= 0 {
		return
	}

	spellDef := magic.GetSpellDef(int(req.SpellId))
	if spellDef == nil {
		e.sendNotification(p, "Unknown spell", 2)
		return
	}

	canCast, reason := p.CanCastSpell(spellDef)
	if !canCast {
		e.sendNotification(p, reason, 2)
		return
	}

	gm, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	// Deduct mana and start cooldown
	p.MP -= spellDef.ManaCost
	p.StartCooldown(spellDef.ID, spellDef.Cooldown)

	// Broadcast casting animation
	castMotion := &pb.MotionEvent{
		ObjectId:  p.ObjectID,
		OwnerType: 1,
		Action:    4, // magic
		Direction: int32(p.Direction),
		Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
		Name:      p.Name,
	}
	e.broadcastToNearby(gm, p.X, p.Y, -1, network.MsgMotionEvent, castMotion)

	// Apply spell effect based on type
	switch spellDef.Type {
	case magic.SpellTypeDamage:
		e.handleDamageSpell(p, spellDef, req.TargetId, gm)
	case magic.SpellTypeAOE:
		e.handleAOESpell(p, spellDef, req.TargetPosition, gm)
	case magic.SpellTypeHeal:
		e.handleHealSpell(p, spellDef, gm)
	case magic.SpellTypeBuff:
		e.handleBuffSpell(p, spellDef, gm)
	case magic.SpellTypeDebuff:
		e.handleDebuffSpell(p, spellDef, req.TargetId, gm)
	}

	// Gain magic skill mastery
	if p.Skills.CanGainMastery(skills.SkillMagic) {
		// 20% chance per cast to gain mastery
		if rand.Intn(5) == 0 {
			p.Skills.GainMastery(skills.SkillMagic)
		}
	}

	e.sendStatUpdate(p)
}

// handleDamageSpell handles single-target damage spells.
func (e *Engine) handleDamageSpell(p *player.Player, spell *magic.SpellDef, targetID int32, gm *mapdata.GameMap) {
	if targetID == 0 {
		e.sendNotification(p, "No target selected", 2)
		return
	}

	// Try NPC target
	npcVal, isNPC := e.npcs.Load(targetID)
	if isNPC {
		n := npcVal.(*npc.NPC)
		if !n.IsAlive() || n.MapName != p.MapName {
			return
		}

		dist := n.DistanceTo(p.X, p.Y)
		if dist > spell.Range {
			e.sendNotification(p, "Target out of range", 2)
			return
		}

		// Calculate spell damage: base + MAG/3 + INT/4
		damage := spell.MinDamage
		dmgRange := spell.MaxDamage - spell.MinDamage
		if dmgRange > 0 {
			damage += rand.Intn(dmgRange + 1)
		}
		damage += p.EffectiveMAG()/3 + p.EffectiveINT()/4

		// Element bonus
		damage = applyElementBonus(damage, spell.Element)

		// Defense reduction (capped at 60% for magic)
		reduction := n.Type.Defense / 2
		maxReduction := damage * 60 / 100
		if reduction > maxReduction {
			reduction = maxReduction
		}
		damage -= reduction
		if damage < 1 {
			damage = 1
		}

		killed := n.TakeDamage(damage)

		// Send spell effect
		e.broadcastSpellEffect(p, spell, targetID, p.X, p.Y, n.X, n.Y, damage, 0, false, gm)

		// Send damage event
		dmgEvent := &pb.DamageEvent{
			AttackerId:  p.ObjectID,
			TargetId:    n.ObjectID,
			TargetType:  2,
			Damage:      int32(damage),
			TargetHp:    int32(n.HP),
			TargetMaxHp: int32(n.MaxHP),
		}
		e.broadcastToNearby(gm, p.X, p.Y, -1, network.MsgDamageEvent, dmgEvent)

		// NPC aggroes caster
		if n.IsAlive() && n.TargetID == 0 {
			n.TargetID = p.ObjectID
			n.State = npc.StateChase
		}

		if killed {
			e.handleNPCDeath(n, p, gm)
		}

		log.Printf("Spell %s hit NPC %s for %d damage", spell.Name, n.Type.Name, damage)
	}
}

// handleAOESpell handles area of effect damage spells.
func (e *Engine) handleAOESpell(p *player.Player, spell *magic.SpellDef, targetPos *pb.Vec2, gm *mapdata.GameMap) {
	tx, ty := int(targetPos.GetX()), int(targetPos.GetY())

	// Check range to target location
	dx := tx - p.X
	dy := ty - p.Y
	if dx < 0 {
		dx = -dx
	}
	if dy < 0 {
		dy = -dy
	}
	dist := dx
	if dy > dist {
		dist = dy
	}
	if dist > spell.Range {
		e.sendNotification(p, "Target location out of range", 2)
		return
	}

	// Send spell effect at target location
	e.broadcastSpellEffect(p, spell, 0, p.X, p.Y, tx, ty, 0, 0, false, gm)

	// Find all NPCs in radius
	e.npcs.Range(func(key, value any) bool {
		n := value.(*npc.NPC)
		if !n.IsAlive() || n.MapName != p.MapName {
			return true
		}

		ndx := n.X - tx
		ndy := n.Y - ty
		if ndx < 0 {
			ndx = -ndx
		}
		if ndy < 0 {
			ndy = -ndy
		}
		ndist := ndx
		if ndy > ndist {
			ndist = ndy
		}
		if ndist > spell.Radius {
			return true
		}

		// Calculate damage
		damage := spell.MinDamage
		dmgRange := spell.MaxDamage - spell.MinDamage
		if dmgRange > 0 {
			damage += rand.Intn(dmgRange + 1)
		}
		damage += p.EffectiveMAG()/4 + p.EffectiveINT()/5

		damage = applyElementBonus(damage, spell.Element)

		reduction := n.Type.Defense / 2
		maxReduction := damage * 60 / 100
		if reduction > maxReduction {
			reduction = maxReduction
		}
		damage -= reduction
		if damage < 1 {
			damage = 1
		}

		killed := n.TakeDamage(damage)

		dmgEvent := &pb.DamageEvent{
			AttackerId:  p.ObjectID,
			TargetId:    n.ObjectID,
			TargetType:  2,
			Damage:      int32(damage),
			TargetHp:    int32(n.HP),
			TargetMaxHp: int32(n.MaxHP),
		}
		e.broadcastToNearby(gm, n.X, n.Y, -1, network.MsgDamageEvent, dmgEvent)

		if n.IsAlive() && n.TargetID == 0 {
			n.TargetID = p.ObjectID
			n.State = npc.StateChase
		}

		if killed {
			e.handleNPCDeath(n, p, gm)
		}
		return true
	})
}

// handleHealSpell handles self-heal spells.
func (e *Engine) handleHealSpell(p *player.Player, spell *magic.SpellDef, gm *mapdata.GameMap) {
	heal := spell.HealAmount + p.EffectiveMAG()/3
	p.HP += heal
	if p.HP > p.MaxHP {
		p.HP = p.MaxHP
	}

	e.broadcastSpellEffect(p, spell, p.ObjectID, p.X, p.Y, p.X, p.Y, 0, heal, false, gm)
	log.Printf("Player %s healed for %d HP", p.Name, heal)
}

// handleBuffSpell handles self-buff spells.
func (e *Engine) handleBuffSpell(p *player.Player, spell *magic.SpellDef, gm *mapdata.GameMap) {
	buff := p.Buffs.AddBuff(spell.ID, spell.Name, spell.BuffStat, spell.BuffAmount, spell.Duration)

	// Send buff update to player
	buffUpdate := &pb.BuffUpdate{
		ObjectId:         p.ObjectID,
		SpellId:          int32(spell.ID),
		Name:             spell.Name,
		StatType:         int32(spell.BuffStat),
		Amount:           int32(spell.BuffAmount),
		RemainingSeconds: int32(buff.RemainingSeconds()),
	}
	data, _ := network.Encode(network.MsgBuffUpdate, buffUpdate)
	p.Send(data)

	e.broadcastSpellEffect(p, spell, p.ObjectID, p.X, p.Y, p.X, p.Y, 0, 0, false, gm)
	log.Printf("Player %s gained buff %s (+%d to stat %d for %ds)", p.Name, spell.Name, spell.BuffAmount, spell.BuffStat, spell.Duration)
}

// handleDebuffSpell handles debuff spells on targets.
func (e *Engine) handleDebuffSpell(p *player.Player, spell *magic.SpellDef, targetID int32, gm *mapdata.GameMap) {
	if targetID == 0 {
		e.sendNotification(p, "No target selected", 2)
		return
	}

	// Check if target is NPC - debuffs don't apply stat modifiers to NPCs,
	// but we still show the effect and can slow them etc. in future
	npcVal, isNPC := e.npcs.Load(targetID)
	if isNPC {
		n := npcVal.(*npc.NPC)
		if !n.IsAlive() || n.MapName != p.MapName {
			return
		}
		dist := n.DistanceTo(p.X, p.Y)
		if dist > spell.Range {
			e.sendNotification(p, "Target out of range", 2)
			return
		}

		e.broadcastSpellEffect(p, spell, targetID, p.X, p.Y, n.X, n.Y, 0, 0, false, gm)
		log.Printf("Player %s cast %s on NPC %s", p.Name, spell.Name, n.Type.Name)
	}
	// TODO: PvP debuffs in Phase 5
}

// handleLearnSpell handles learning a new spell.
func (e *Engine) handleLearnSpell(client *network.Client, req *pb.LearnSpellRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	spellDef := magic.GetSpellDef(int(req.SpellId))
	if spellDef == nil {
		e.sendNotification(p, "Unknown spell", 2)
		return
	}

	if p.LearnedSpells[spellDef.ID] {
		e.sendNotification(p, "You already know this spell", 2)
		return
	}

	// Check requirements
	if p.Level < spellDef.ReqLevel {
		e.sendNotification(p, fmt.Sprintf("Requires level %d", spellDef.ReqLevel), 2)
		return
	}
	if p.MAG < spellDef.ReqMAG {
		e.sendNotification(p, fmt.Sprintf("Requires %d MAG", spellDef.ReqMAG), 2)
		return
	}
	if p.INT < spellDef.ReqINT {
		e.sendNotification(p, fmt.Sprintf("Requires %d INT", spellDef.ReqINT), 2)
		return
	}

	p.LearnSpell(spellDef.ID)
	e.sendSpellList(p)
	e.sendNotification(p, fmt.Sprintf("Learned %s!", spellDef.Name), 3)
	log.Printf("Player %s learned spell %s", p.Name, spellDef.Name)
}

// handleSkillUse handles using a gathering/crafting skill.
func (e *Engine) handleSkillUse(client *network.Client, req *pb.SkillUseRequest) {
	p := e.getPlayerByClient(client)
	if p == nil || p.HP <= 0 {
		return
	}

	skillID := skills.SkillID(req.SkillId)
	skillDef := skills.GetSkillDef(skillID)
	if skillDef == nil {
		e.sendNotification(p, "Unknown skill", 2)
		return
	}

	mastery := p.Skills.GetMastery(skillID)

	switch skillID {
	case skills.SkillMining:
		e.handleMining(p, mastery)
	case skills.SkillFishing:
		e.handleFishing(p, mastery)
	default:
		e.sendNotification(p, "This skill cannot be used directly", 2)
	}
}

// handleMining performs a mining action.
func (e *Engine) handleMining(p *player.Player, mastery int) {
	// Check for pickaxe equipped (future: specific tool items)
	// For now just do the skill check
	if p.SP < 5 {
		e.sendNotification(p, "Not enough stamina", 2)
		return
	}
	p.SP -= 5

	success := skills.SkillCheck(mastery+20, 10) // base +20 for easier starting
	result := &pb.SkillResultEvent{
		SkillId: int32(skills.SkillMining),
	}

	if success {
		// Give iron ore
		oreDef := items.GetItemDef(210) // Iron Ore
		if oreDef != nil {
			ore := items.NewItem(oreDef, 1)
			slot := p.Inventory.AddItem(ore)
			if slot >= 0 {
				result.Success = true
				result.Message = "You mined some iron ore!"
				result.ItemGainedId = 210
				e.sendInventoryUpdate(p)
			} else {
				result.Message = "Inventory full!"
			}
		}
	} else {
		result.Message = "You failed to mine anything useful."
	}

	// Try mastery gain
	newMastery, gained := p.Skills.GainMastery(skills.SkillMining)
	if gained {
		result.NewMastery = int32(newMastery)
	}

	data, _ := network.Encode(network.MsgSkillResult, result)
	p.Send(data)
	e.sendStatUpdate(p)
}

// handleFishing performs a fishing action.
func (e *Engine) handleFishing(p *player.Player, mastery int) {
	if p.SP < 3 {
		e.sendNotification(p, "Not enough stamina", 2)
		return
	}
	p.SP -= 3

	success := skills.SkillCheck(mastery+25, 5) // slightly easier than mining
	result := &pb.SkillResultEvent{
		SkillId: int32(skills.SkillFishing),
	}

	if success {
		fishDef := items.GetItemDef(220) // Raw Fish
		if fishDef != nil {
			fish := items.NewItem(fishDef, 1)
			slot := p.Inventory.AddItem(fish)
			if slot >= 0 {
				result.Success = true
				result.Message = "You caught a fish!"
				result.ItemGainedId = 220
				e.sendInventoryUpdate(p)
			} else {
				result.Message = "Inventory full!"
			}
		}
	} else {
		result.Message = "The fish got away..."
	}

	newMastery, gained := p.Skills.GainMastery(skills.SkillFishing)
	if gained {
		result.NewMastery = int32(newMastery)
	}

	data, _ := network.Encode(network.MsgSkillResult, result)
	p.Send(data)
	e.sendStatUpdate(p)
}

// handleCraft handles crafting an item from a recipe.
func (e *Engine) handleCraft(client *network.Client, req *pb.CraftRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	recipe := skills.GetRecipe(int(req.RecipeId))
	if recipe == nil {
		e.sendNotification(p, "Unknown recipe", 2)
		return
	}

	// Check skill mastery requirement
	mastery := p.Skills.GetMastery(recipe.Skill)
	if mastery < recipe.ReqMastery {
		e.sendNotification(p, fmt.Sprintf("Requires %d %s mastery", recipe.ReqMastery,
			skills.GetSkillDef(recipe.Skill).Name), 2)
		return
	}

	// Check all inputs are available
	for _, input := range recipe.Inputs {
		if p.Inventory.CountItem(input.ItemID) < input.Count {
			def := items.GetItemDef(input.ItemID)
			name := "item"
			if def != nil {
				name = def.Name
			}
			e.sendNotification(p, fmt.Sprintf("Need %d %s", input.Count, name), 2)
			return
		}
	}

	// Check inventory space for output
	if !p.Inventory.HasSpace() {
		e.sendNotification(p, "Inventory full", 2)
		return
	}

	// Consume inputs
	for _, input := range recipe.Inputs {
		remaining := input.Count
		for i := 0; i < items.MaxInventorySlots && remaining > 0; i++ {
			item := p.Inventory.GetItem(i)
			if item == nil || item.DefID != input.ItemID {
				continue
			}
			remove := remaining
			if remove > item.Count {
				remove = item.Count
			}
			p.Inventory.RemoveItem(i, remove)
			remaining -= remove
		}
	}

	// Skill check for success
	result := &pb.CraftResult{}
	if skills.SkillCheck(mastery+30, recipe.ReqMastery/2) {
		outputDef := items.GetItemDef(recipe.OutputID)
		if outputDef != nil {
			newItem := items.NewItem(outputDef, recipe.OutputCount)
			p.Inventory.AddItem(newItem)
			result.Success = true
			result.Message = fmt.Sprintf("Created %s!", outputDef.Name)
			result.ItemId = int32(recipe.OutputID)
			result.Count = int32(recipe.OutputCount)
		}
	} else {
		result.Message = "Crafting failed! Materials were consumed."
	}

	// Try mastery gain
	p.Skills.GainMastery(recipe.Skill)

	data, _ := network.Encode(network.MsgCraftResult, result)
	p.Send(data)
	e.sendInventoryUpdate(p)
	e.sendSkillList(p)
}

// broadcastSpellEffect sends a spell visual effect to nearby players.
func (e *Engine) broadcastSpellEffect(caster *player.Player, spell *magic.SpellDef,
	targetID int32, cx, cy, tx, ty int, damage, heal int, miss bool, gm *mapdata.GameMap) {

	effect := &pb.SpellEffectEvent{
		CasterId:       caster.ObjectID,
		SpellId:        int32(spell.ID),
		TargetId:       targetID,
		CasterPosition: &pb.Vec2{X: int32(cx), Y: int32(cy)},
		TargetPosition: &pb.Vec2{X: int32(tx), Y: int32(ty)},
		Damage:         int32(damage),
		HealAmount:     int32(heal),
		Miss:           miss,
		SpriteId:       int32(spell.SpriteID),
		SoundId:        int32(spell.SoundID),
	}
	e.broadcastToNearby(gm, cx, cy, -1, network.MsgSpellEffect, effect)
}

// sendSpellList sends the player's known spells.
func (e *Engine) sendSpellList(p *player.Player) {
	update := p.ToSpellList()
	data, _ := network.Encode(network.MsgSpellList, update)
	p.Send(data)
}

// sendSkillList sends the player's skill masteries.
func (e *Engine) sendSkillList(p *player.Player) {
	update := p.ToSkillList()
	data, _ := network.Encode(network.MsgSkillList, update)
	p.Send(data)
}

// checkBuffExpiry checks all players for expired buffs and removes them.
func (e *Engine) checkBuffExpiry() {
	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		expired := p.Buffs.CleanExpired()
		for _, buff := range expired {
			// Send buff removal notification
			buffUpdate := &pb.BuffUpdate{
				ObjectId: p.ObjectID,
				SpellId:  int32(buff.SpellID),
				Name:     buff.Name,
				StatType: int32(buff.StatType),
				Amount:   int32(buff.Amount),
				Removed:  true,
			}
			data, _ := network.Encode(network.MsgBuffUpdate, buffUpdate)
			p.Send(data)

			e.sendNotification(p, buff.Name+" has worn off", 0)
		}
		return true
	})
}

// applyElementBonus adds a small element-based bonus to damage.
func applyElementBonus(damage int, element magic.SpellElement) int {
	// 10% bonus for elemental spells
	if element != magic.ElementNone {
		damage = damage * 110 / 100
	}
	return damage
}
