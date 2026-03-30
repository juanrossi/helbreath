package game

import (
	"math/rand"

	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/skills"
)

// CombatResult holds the outcome of a single attack.
type CombatResult struct {
	Damage   int
	Critical bool
	Miss     bool
	Killed   bool
}

// PlayerAttackNPC calculates damage from a player attacking an NPC.
// Ported from C++ iCalculateAttackEffect (Game.cpp:60905).
func PlayerAttackNPC(p *player.Player, n *npc.NPC) CombatResult {
	// Hit check: ratio-based formula from C++ (Game.cpp:61837)
	// iDestHitRatio = (iAttackerHitRatio / iTargetDefenseRatio) * 50.0
	hitChance := calcHitChance(p.HitRatio, n.Type.Defense) + HitBonus
	if hitChance > 99 {
		hitChance = 99
	}
	if rand.Intn(100)+1 > hitChance {
		return CombatResult{Miss: true}
	}

	// Roll weapon dice based on NPC size (SM vs L dice sets)
	var damage int
	if n.Type.Size >= npc.SizeLarge && p.AttDiceThrowL > 0 {
		damage = iDice(p.AttDiceThrowL, p.AttDiceRangeL)
	} else {
		damage = iDice(p.AttDiceThrowSM, p.AttDiceRangeSM)
	}
	damage += p.AttBonus

	// Multiplicative STR scaling: damage * (1 + STR/500)
	str := p.EffectiveSTR()
	damage += damage * str / 500

	// Level bonus
	damage += p.Level

	// Difficulty multiplier — makes the game easier
	damage *= DamageMultiplier

	// Critical hit via attack mode (C++ triggers when iAttackMode >= 20)
	critical := false
	if p.AttackMode >= 20 && p.SuperAttackLeft > 0 {
		critical = true
		// Bonus = level/100 as percentage of current damage
		damage += damage * p.Level / 100
		p.SuperAttackLeft--
		if p.SuperAttackLeft <= 0 {
			p.AttackMode = 0
		}
	}

	// Berserk effect: multiply damage by (1 + level * 0.2)
	if p.Effects != nil {
		berserkLevel := p.Effects.GetEffectLevel(magic.EffectBerserk)
		if berserkLevel > 0 {
			damage = damage * (100 + berserkLevel*20) / 100
		}
	}

	// NPC defense absorption
	damage -= n.Type.Defense
	if damage < 1 {
		damage = 1
	}

	// God mode: multiply damage by 1000
	if p.GodMode {
		damage *= 1000
	}

	killed := n.TakeDamage(damage)

	// Break invisibility on attack
	if p.Effects != nil && p.Effects.HasEffect(magic.EffectInvisibility) {
		p.Effects.RemoveEffect(magic.EffectInvisibility)
	}

	// Train weapon skill (20% chance per attack)
	trainWeaponSkill(p)

	// Degrade weapon durability (special attacks cost more)
	if critical {
		p.Inventory.DegradeWeaponBy(15)
	} else {
		p.Inventory.DegradeWeapon()
	}

	return CombatResult{
		Damage:   damage,
		Critical: critical,
		Killed:   killed,
	}
}

// NPCAttackPlayer calculates damage from an NPC attacking a player.
// Ported from C++ NPC attack logic with dice-based damage and layered defense.
func NPCAttackPlayer(n *npc.NPC, p *player.Player) CombatResult {
	// God mode: target is invulnerable
	if p.GodMode {
		return CombatResult{Damage: 0, Miss: true}
	}

	// Hit check: ratio-based formula from C++ (Game.cpp:61837)
	hitChance := calcHitChance(n.Type.DEX, p.DefenseRatio)
	if rand.Intn(100)+1 > hitChance {
		return CombatResult{Miss: true}
	}

	// Roll NPC dice damage (or fallback to MinDamage/MaxDamage)
	var baseDamage int
	if n.Type.DiceThrow > 0 {
		baseDamage = iDice(n.Type.DiceThrow, n.Type.DiceRange) + n.Type.AttackBonus
	} else {
		dmgRange := n.Type.MaxDamage - n.Type.MinDamage
		baseDamage = n.Type.MinDamage
		if dmgRange > 0 {
			baseDamage += rand.Intn(dmgRange + 1)
		}
	}

	// Layered defense: subtract each armor layer independently
	// Ported from C++: AP_Abs_Armor, AP_Abs_Shield, AP_Abs_Cape, etc.
	damage := baseDamage
	damage -= p.ArmorAbs
	damage -= p.ShieldAbs
	damage -= p.CapeAbs
	damage -= p.HelmAbs
	damage -= p.LeggingsAbs
	damage -= p.BootsAbs

	// Defense shield effect: absorb additional flat damage
	if p.Effects != nil {
		shieldLevel := p.Effects.GetEffectLevel(magic.EffectDefenseShield)
		if shieldLevel > 0 {
			damage -= magic.CalcDefenseShieldAbsorb(shieldLevel)
		}
	}

	// Ice effect on target: reduced defense effectiveness (take 20% more damage per level)
	if p.Effects != nil {
		iceLevel := p.Effects.GetEffectLevel(magic.EffectIce)
		if iceLevel > 0 && damage > 0 {
			damage = damage * (100 + iceLevel*20) / 100
		}
	}

	// Berserk effect on target: reduced defense (take 20% more damage per level)
	if p.Effects != nil {
		berserkLevel := p.Effects.GetEffectLevel(magic.EffectBerserk)
		if berserkLevel > 0 && damage > 0 {
			damage = damage * (100 + berserkLevel*20) / 100
		}
	}

	// Difficulty: reduce NPC damage to players
	if NPCDamageReduction > 1 {
		damage = damage / NPCDamageReduction
	}
	if damage < 1 {
		damage = 1
	}

	p.HP -= damage
	killed := false
	if p.HP <= 0 {
		p.HP = 0
		killed = true
	}

	// Break invisibility when taking damage
	if p.Effects != nil && p.Effects.HasEffect(magic.EffectInvisibility) {
		p.Effects.RemoveEffect(magic.EffectInvisibility)
	}

	// Degrade a random armor piece
	p.Inventory.DegradeArmor()

	// Train defense skill (20% chance when hit)
	if rand.Intn(5) == 0 {
		p.Skills.GainMastery(skills.SkillDefense)
		if p.Inventory.GetEquipped(items.EquipShield) != nil {
			p.Skills.GainMastery(skills.SkillShield)
		}
	}

	return CombatResult{
		Damage:   damage,
		Critical: false,
		Killed:   killed,
	}
}

// PlayerAttackPlayer calculates damage from a player attacking another player.
// Uses the same dice/STR/defense model as PlayerAttackNPC but with player defense layers.
func PlayerAttackPlayer(attacker, target *player.Player) CombatResult {
	// God mode: target is invulnerable
	if target.GodMode {
		return CombatResult{Damage: 0, Miss: true}
	}

	// Hit check: ratio-based formula from C++ (Game.cpp:61837)
	hitChance := calcHitChance(attacker.HitRatio, target.DefenseRatio)
	if rand.Intn(100)+1 > hitChance {
		return CombatResult{Miss: true}
	}

	// Roll weapon dice (players are always "medium" size)
	damage := iDice(attacker.AttDiceThrowSM, attacker.AttDiceRangeSM) + attacker.AttBonus

	// Multiplicative STR scaling
	str := attacker.EffectiveSTR()
	damage += damage * str / 500

	// Level bonus
	damage += attacker.Level

	// Critical hit via attack mode
	critical := false
	if attacker.AttackMode >= 20 && attacker.SuperAttackLeft > 0 {
		critical = true
		damage += damage * attacker.Level / 100
		attacker.SuperAttackLeft--
		if attacker.SuperAttackLeft <= 0 {
			attacker.AttackMode = 0
		}
	}

	// Berserk effect on attacker: multiply damage
	if attacker.Effects != nil {
		berserkLevel := attacker.Effects.GetEffectLevel(magic.EffectBerserk)
		if berserkLevel > 0 {
			damage = damage * (100 + berserkLevel*20) / 100
		}
	}

	// Layered defense absorption
	damage -= target.ArmorAbs
	damage -= target.ShieldAbs
	damage -= target.CapeAbs
	damage -= target.HelmAbs
	damage -= target.LeggingsAbs
	damage -= target.BootsAbs

	// Defense shield on target
	if target.Effects != nil {
		shieldLevel := target.Effects.GetEffectLevel(magic.EffectDefenseShield)
		if shieldLevel > 0 {
			damage -= magic.CalcDefenseShieldAbsorb(shieldLevel)
		}
	}

	// Ice effect on target: reduced defense
	if target.Effects != nil {
		iceLevel := target.Effects.GetEffectLevel(magic.EffectIce)
		if iceLevel > 0 && damage > 0 {
			damage = damage * (100 + iceLevel*20) / 100
		}
	}

	// Berserk effect on target: reduced defense
	if target.Effects != nil {
		berserkLevel := target.Effects.GetEffectLevel(magic.EffectBerserk)
		if berserkLevel > 0 && damage > 0 {
			damage = damage * (100 + berserkLevel*20) / 100
		}
	}

	if damage < 1 {
		damage = 1
	}

	// God mode: attacker deals 1000x damage
	if attacker.GodMode {
		damage *= 1000
	}

	target.HP -= damage
	killed := false
	if target.HP <= 0 {
		target.HP = 0
		killed = true
	}

	// Break invisibility on attack or when taking damage
	if attacker.Effects != nil && attacker.Effects.HasEffect(magic.EffectInvisibility) {
		attacker.Effects.RemoveEffect(magic.EffectInvisibility)
	}
	if target.Effects != nil && target.Effects.HasEffect(magic.EffectInvisibility) {
		target.Effects.RemoveEffect(magic.EffectInvisibility)
	}

	// Train weapon skill for attacker, defense for target
	trainWeaponSkill(attacker)
	if rand.Intn(5) == 0 {
		target.Skills.GainMastery(skills.SkillDefense)
		if target.Inventory.GetEquipped(items.EquipShield) != nil {
			target.Skills.GainMastery(skills.SkillShield)
		}
	}

	// Degrade equipment
	if critical {
		attacker.Inventory.DegradeWeaponBy(15)
	} else {
		attacker.Inventory.DegradeWeapon()
	}
	target.Inventory.DegradeArmor()

	return CombatResult{
		Damage:   damage,
		Critical: critical,
		Killed:   killed,
	}
}

// trainWeaponSkill trains the appropriate weapon skill for the player's equipped weapon.
// 20% chance to gain mastery per attack, matching C++ training rates.
func trainWeaponSkill(p *player.Player) {
	weapon := p.Inventory.GetEquipped(items.EquipWeapon)
	skillID := skills.SkillHandCombat // unarmed default
	if weapon != nil {
		def := weapon.Def()
		if def != nil && def.WeaponSkillID > 0 {
			skillID = skills.SkillID(def.WeaponSkillID)
		}
	}
	// 20% chance to gain mastery on attack
	if rand.Intn(5) == 0 {
		p.Skills.GainMastery(skillID)
		// Also train general Attack skill
		p.Skills.GainMastery(skills.SkillAttack)
	}
}

// XPForLevel returns the total XP needed to reach a given level.
// Ported from C++ iGetLevelExp (Game.cpp:25858):
//
//	XP(n) = XP(n-1) + n * (50 + (n/17)^2)
//
// This produces a steeper curve at high levels than the old level^2 * 100 formula.
func XPForLevel(level int) int64 {
	if level <= 1 {
		return 0
	}
	var total int64
	for i := 2; i <= level; i++ {
		q := int64(i / 17)
		total += int64(i) * (50 + q*q)
	}
	return total
}

// MaxLevel is the maximum player level. Once reached, excess XP converts to Gizon points.
const MaxLevel = 100

// GizonXPRate is the amount of excess XP required per 1 Gizon point.
const GizonXPRate = 10000

// CheckLevelUp checks if a player has enough XP to level up and applies it.
// Returns true if level changed or Gizon points were awarded.
func CheckLevelUp(p *player.Player) bool {
	// At max level, convert excess XP to Gizon points
	if p.Level >= MaxLevel {
		needed := XPForLevel(MaxLevel)
		excess := p.Experience - needed
		if excess > 0 {
			gizonGained := excess / GizonXPRate
			if gizonGained > 0 {
				p.GizonPoints += gizonGained
				p.Experience = needed + (excess % GizonXPRate)
				return true
			}
		}
		return false
	}

	changed := false
	for {
		if p.Level >= MaxLevel {
			break
		}
		needed := XPForLevel(p.Level + 1)
		if p.Experience < needed {
			break
		}
		p.Level++
		p.LUPool += 3 // 3 stat points per level
		// Recalculate max stats
		p.MaxHP = 30 + (p.Level-1)*3 + p.VIT*2
		p.MaxMP = 10 + (p.Level-1)*2 + p.MAG*2
		p.MaxSP = 30 + p.Level*2
		// Full heal on level up
		p.HP = p.MaxHP
		p.MP = p.MaxMP
		p.SP = p.MaxSP
		changed = true
	}
	if changed {
		p.RecalcCombatStats()
	}
	return changed
}

// MaxStatValue is the cap for each individual stat (STR, VIT, DEX, INT, MAG, CHR).
const MaxStatValue = 100

// CalcDayNightBonus returns the bonus damage for a player's equipped weapon
// based on the current world phase. Weapons with DayBonus get +bonus during day,
// weapons with NightBonus get +bonus during night.
func CalcDayNightBonus(p *player.Player, worldPhase int) int {
	weapon := p.Inventory.GetEquipped(items.EquipWeapon)
	if weapon == nil {
		return 0
	}
	def := weapon.Def()
	if def == nil {
		return 0
	}
	bonus := 0
	// Day phase (phase 0) gives day bonus
	if worldPhase == 0 && def.DayBonus > 0 {
		bonus += def.DayBonus
	}
	// Night phase (phase 2) gives night bonus
	if worldPhase == 2 && def.NightBonus > 0 {
		bonus += def.NightBonus
	}
	return bonus
}

// calcHitChance computes the hit probability using the C++ ratio formula:
//
//	hitChance = (attackerHitRatio / defenderDefenseRatio) * 50.0
//	clamped to [15, 99] (DEF_MINIMUMHITRATIO / DEF_MAXIMUMHITRATIO)
//
// If defenderRatio is 0, returns 99 (guaranteed hit).
func calcHitChance(attackerRatio, defenderRatio int) int {
	if defenderRatio <= 0 {
		return 99
	}
	hitChance := int(float64(attackerRatio) / float64(defenderRatio) * 50.0)
	return clamp(hitChance, 15, 99)
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
