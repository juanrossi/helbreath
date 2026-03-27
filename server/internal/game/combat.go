package game

import (
	"math/rand"

	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/player"
)

// CombatResult holds the outcome of a single attack.
type CombatResult struct {
	Damage   int
	Critical bool
	Miss     bool
	Killed   bool
}

// PlayerAttackNPC calculates damage from a player attacking an NPC.
func PlayerAttackNPC(p *player.Player, n *npc.NPC) CombatResult {
	// Hit chance: 50% + (attacker DEX - target DEX) * 2, clamped 10-95%
	hitChance := 50 + (p.DEX-n.Type.DEX)*2
	if hitChance < 10 {
		hitChance = 10
	}
	if hitChance > 95 {
		hitChance = 95
	}

	roll := rand.Intn(100) + 1
	if roll > hitChance {
		return CombatResult{Miss: true}
	}

	// Use weapon damage if equipped, otherwise STR-based
	minDmg, maxDmg := p.Inventory.WeaponDamage()
	baseDamage := minDmg
	if maxDmg > minDmg {
		baseDamage += rand.Intn(maxDmg - minDmg + 1)
	}
	// Add STR bonus and level bonus
	baseDamage += p.STR/3 + p.Level

	// Defense reduction (capped at 80% of base damage)
	reduction := n.Type.Defense
	maxReduction := baseDamage * 80 / 100
	if reduction > maxReduction {
		reduction = maxReduction
	}
	damage := baseDamage - reduction
	if damage < 1 {
		damage = 1
	}

	// Critical hit: 10% chance, 1.5x damage
	critical := false
	if rand.Intn(100) < 10 {
		critical = true
		damage = damage * 3 / 2
	}

	killed := n.TakeDamage(damage)

	// Degrade weapon durability
	p.Inventory.DegradeWeapon()

	return CombatResult{
		Damage:   damage,
		Critical: critical,
		Killed:   killed,
	}
}

// NPCAttackPlayer calculates damage from an NPC attacking a player.
func NPCAttackPlayer(n *npc.NPC, p *player.Player) CombatResult {
	// Hit chance: 50% + (NPC DEX - player DEX) * 2
	hitChance := 50 + (n.Type.DEX-p.DEX)*2
	if hitChance < 10 {
		hitChance = 10
	}
	if hitChance > 95 {
		hitChance = 95
	}

	roll := rand.Intn(100) + 1
	if roll > hitChance {
		return CombatResult{Miss: true}
	}

	// NPC damage: random in range [MinDamage, MaxDamage]
	dmgRange := n.Type.MaxDamage - n.Type.MinDamage
	baseDamage := n.Type.MinDamage
	if dmgRange > 0 {
		baseDamage += rand.Intn(dmgRange + 1)
	}

	// Player defense from VIT + equipped armor
	armorDef := p.Inventory.TotalDefense()
	reduction := p.VIT/5 + armorDef
	maxReduction := baseDamage * 80 / 100
	if reduction > maxReduction {
		reduction = maxReduction
	}
	damage := baseDamage - reduction
	if damage < 1 {
		damage = 1
	}

	p.HP -= damage
	killed := false
	if p.HP <= 0 {
		p.HP = 0
		killed = true
	}

	// Degrade a random armor piece
	p.Inventory.DegradeArmor()

	return CombatResult{
		Damage:   damage,
		Critical: false,
		Killed:   killed,
	}
}

// PlayerAttackPlayer calculates damage from a player attacking another player.
func PlayerAttackPlayer(attacker, target *player.Player) CombatResult {
	// Hit chance: 50% + (attacker DEX - target DEX) * 2, clamped 10-95%
	hitChance := 50 + (attacker.DEX-target.DEX)*2
	if hitChance < 10 {
		hitChance = 10
	}
	if hitChance > 95 {
		hitChance = 95
	}

	roll := rand.Intn(100) + 1
	if roll > hitChance {
		return CombatResult{Miss: true}
	}

	// Weapon damage
	minDmg, maxDmg := attacker.Inventory.WeaponDamage()
	baseDamage := minDmg
	if maxDmg > minDmg {
		baseDamage += rand.Intn(maxDmg - minDmg + 1)
	}
	baseDamage += attacker.STR/3 + attacker.Level

	// Target defense from VIT + armor
	armorDef := target.Inventory.TotalDefense()
	reduction := target.VIT/5 + armorDef
	maxReduction := baseDamage * 80 / 100
	if reduction > maxReduction {
		reduction = maxReduction
	}
	damage := baseDamage - reduction
	if damage < 1 {
		damage = 1
	}

	// Critical hit: Level% chance, 1.5x damage
	critical := false
	critChance := attacker.Level
	if critChance > 30 {
		critChance = 30
	}
	if rand.Intn(100) < critChance {
		critical = true
		damage = damage * 3 / 2
	}

	target.HP -= damage
	killed := false
	if target.HP <= 0 {
		target.HP = 0
		killed = true
	}

	// Degrade equipment
	attacker.Inventory.DegradeWeapon()
	target.Inventory.DegradeArmor()

	return CombatResult{
		Damage:   damage,
		Critical: critical,
		Killed:   killed,
	}
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

// XPForLevel returns the total XP needed to reach a given level.
func XPForLevel(level int) int64 {
	// Exponential scaling: level^2 * 100
	return int64(level) * int64(level) * 100
}

// CheckLevelUp checks if a player has enough XP to level up and applies it.
// Returns true if level changed.
func CheckLevelUp(p *player.Player) bool {
	changed := false
	for {
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
	return changed
}
