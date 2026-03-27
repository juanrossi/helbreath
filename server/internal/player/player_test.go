package player

import (
	"testing"
	"time"

	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
)

func TestFromDB(t *testing.T) {
	row := &db.CharacterRow{
		ID:             1,
		AccountID:      1,
		Name:           "TestChar",
		Gender:         0,
		SkinColor:      1,
		HairStyle:      3,
		HairColor:      2,
		UnderwearColor: 0,
		Side:           1,
		Level:          5,
		Experience:     1000,
		STR:            15,
		VIT:            12,
		DEX:            14,
		INT:            10,
		MAG:            10,
		CHR:            10,
		LUPool:         6,
		HP:             50,
		MP:             30,
		SP:             40,
		MapName:        "default",
		PosX:           50,
		PosY:           50,
		Direction:      5,
		AdminLevel:     0,
		PKCount:        0,
		EKCount:        0,
		Hunger:         100,
		Gold:           500,
	}

	p := FromDB(row, 1000, nil)

	if p.ObjectID != 1000 {
		t.Errorf("Expected ObjectID=1000, got %d", p.ObjectID)
	}
	if p.Name != "TestChar" {
		t.Errorf("Expected Name=TestChar, got %s", p.Name)
	}
	if p.Level != 5 {
		t.Errorf("Expected Level=5, got %d", p.Level)
	}

	// Check max stats calculation
	expectedMaxHP := 30 + (5-1)*3 + 12*2
	if p.MaxHP != expectedMaxHP {
		t.Errorf("Expected MaxHP=%d, got %d", expectedMaxHP, p.MaxHP)
	}
	expectedMaxMP := 10 + (5-1)*2 + 10*2
	if p.MaxMP != expectedMaxMP {
		t.Errorf("Expected MaxMP=%d, got %d", expectedMaxMP, p.MaxMP)
	}
	expectedMaxSP := 30 + 5*2
	if p.MaxSP != expectedMaxSP {
		t.Errorf("Expected MaxSP=%d, got %d", expectedMaxSP, p.MaxSP)
	}

	if p.Inventory == nil {
		t.Error("Inventory should be initialized")
	}
}

func TestFromDBClampHP(t *testing.T) {
	row := &db.CharacterRow{
		ID:        1,
		AccountID: 1,
		Name:      "Test",
		Level:     1,
		STR:       10,
		VIT:       10,
		DEX:       10,
		INT:       10,
		MAG:       10,
		CHR:       10,
		HP:        9999, // way over max
		MP:        9999,
		SP:        9999,
		MapName:   "default",
	}

	p := FromDB(row, 1, nil)
	if p.HP > p.MaxHP {
		t.Errorf("HP should be clamped: %d > %d", p.HP, p.MaxHP)
	}
	if p.MP > p.MaxMP {
		t.Errorf("MP should be clamped: %d > %d", p.MP, p.MaxMP)
	}
	if p.SP > p.MaxSP {
		t.Errorf("SP should be clamped: %d > %d", p.SP, p.MaxSP)
	}
}

func TestToContents(t *testing.T) {
	row := &db.CharacterRow{
		ID: 1, AccountID: 1, Name: "Test", Level: 3,
		STR: 12, VIT: 11, DEX: 13, INT: 10, MAG: 10, CHR: 10,
		HP: 40, MP: 20, SP: 30, MapName: "default", PosX: 10, PosY: 20,
		Direction: 3, Gold: 100,
	}
	p := FromDB(row, 42, nil)
	contents := p.ToContents()

	if contents.ObjectId != 42 {
		t.Errorf("Expected ObjectId=42, got %d", contents.ObjectId)
	}
	if contents.Name != "Test" {
		t.Errorf("Expected name=Test, got %s", contents.Name)
	}
	if contents.Level != 3 {
		t.Errorf("Expected level=3, got %d", contents.Level)
	}
	if contents.Gold != 100 {
		t.Errorf("Expected gold=100, got %d", contents.Gold)
	}
}

func TestToAppearance(t *testing.T) {
	row := &db.CharacterRow{
		ID: 1, AccountID: 1, Name: "Test", Level: 1,
		Gender: 1, SkinColor: 2, HairStyle: 5, HairColor: 3, UnderwearColor: 1,
		STR: 10, VIT: 10, DEX: 10, INT: 10, MAG: 10, CHR: 10,
		HP: 30, MP: 10, SP: 30, MapName: "default",
	}
	p := FromDB(row, 1, nil)
	appr := p.ToAppearance()

	if appr.Gender != 1 {
		t.Errorf("Expected gender=1, got %d", appr.Gender)
	}
	if appr.SkinColor != 2 {
		t.Errorf("Expected skinColor=2, got %d", appr.SkinColor)
	}
	if appr.HairStyle != 5 {
		t.Errorf("Expected hairStyle=5, got %d", appr.HairStyle)
	}
}

func TestSyncEquipmentAppearance(t *testing.T) {
	row := &db.CharacterRow{
		ID: 1, AccountID: 1, Name: "Test", Level: 1,
		STR: 10, VIT: 10, DEX: 10, INT: 10, MAG: 10, CHR: 10,
		HP: 30, MP: 10, SP: 30, MapName: "default",
	}
	p := FromDB(row, 1, nil)

	// No equipment - all should be 0
	p.SyncEquipmentAppearance()
	if p.Weapon != 0 || p.BodyArmor != 0 || p.Helm != 0 {
		t.Error("No equipment should mean all appearance = 0")
	}

	// Equip Short Sword (ApprIndex=1)
	sword := items.NewItem(items.GetItemDef(1), 1)
	p.Inventory.AddItem(sword)
	p.Inventory.Equip(0)
	p.SyncEquipmentAppearance()

	if p.Weapon != 1 {
		t.Errorf("Expected Weapon=1, got %d", p.Weapon)
	}

	// Equip Leather Armor (ApprIndex=1)
	armor := items.NewItem(items.GetItemDef(40), 1)
	p.Inventory.AddItem(armor)
	p.Inventory.Equip(0)
	p.SyncEquipmentAppearance()

	if p.BodyArmor != 1 {
		t.Errorf("Expected BodyArmor=1, got %d", p.BodyArmor)
	}
}

func TestMeetsRequirements(t *testing.T) {
	row := &db.CharacterRow{
		ID: 1, AccountID: 1, Name: "Test", Level: 5,
		STR: 14, VIT: 10, DEX: 12, INT: 10, MAG: 10, CHR: 10,
		HP: 30, MP: 10, SP: 30, MapName: "default",
	}
	p := FromDB(row, 1, nil)

	// Short Sword: req level 1, no stat reqs
	sword := items.GetItemDef(1)
	if !p.MeetsRequirements(sword) {
		t.Error("Level 5 player should meet Short Sword requirements")
	}

	// Battle Axe: req level 8, STR 15
	axe := items.GetItemDef(3)
	if p.MeetsRequirements(axe) {
		t.Error("Level 5 with STR 14 should not meet Battle Axe requirements (level 8, STR 15)")
	}
}

func TestToInventoryUpdate(t *testing.T) {
	row := &db.CharacterRow{
		ID: 1, AccountID: 1, Name: "Test", Level: 1,
		STR: 10, VIT: 10, DEX: 10, INT: 10, MAG: 10, CHR: 10,
		HP: 30, MP: 10, SP: 30, MapName: "default", Gold: 250,
	}
	p := FromDB(row, 1, nil)

	// Add some items
	p.Inventory.AddItem(items.NewItem(items.GetItemDef(100), 5)) // 5x Small HP Potion
	p.Inventory.AddItem(items.NewItem(items.GetItemDef(1), 1))   // Short Sword

	// Equip sword
	p.Inventory.Equip(1)

	update := p.ToInventoryUpdate()
	if update.Gold != 250 {
		t.Errorf("Expected gold=250, got %d", update.Gold)
	}
	if len(update.Items) != 1 { // only potions left in inventory
		t.Errorf("Expected 1 inventory item, got %d", len(update.Items))
	}
	if len(update.Equipment) != 1 { // sword equipped
		t.Errorf("Expected 1 equipped item, got %d", len(update.Equipment))
	}
}

func TestToPlayerAppear(t *testing.T) {
	row := &db.CharacterRow{
		ID: 1, AccountID: 1, Name: "TestChar", Level: 10,
		STR: 10, VIT: 10, DEX: 10, INT: 10, MAG: 10, CHR: 10,
		HP: 50, MP: 30, SP: 40, MapName: "default", PosX: 30, PosY: 40,
		Direction: 3, Side: 1,
	}
	p := FromDB(row, 42, nil)
	appear := p.ToPlayerAppear()

	if appear.ObjectId != 42 {
		t.Errorf("Expected ObjectId=42, got %d", appear.ObjectId)
	}
	if appear.Name != "TestChar" {
		t.Errorf("Expected TestChar, got %s", appear.Name)
	}
	if appear.Level != 10 {
		t.Errorf("Expected level=10, got %d", appear.Level)
	}
	if appear.Side != 1 {
		t.Errorf("Expected side=1, got %d", appear.Side)
	}
}

func makeTestPlayer() *Player {
	row := &db.CharacterRow{
		ID: 1, AccountID: 1, Name: "Mage", Level: 10,
		STR: 10, VIT: 12, DEX: 10, INT: 15, MAG: 20, CHR: 10,
		HP: 50, MP: 50, SP: 40, MapName: "default", PosX: 50, PosY: 50,
	}
	return FromDB(row, 100, nil)
}

func TestEffectiveStats(t *testing.T) {
	p := makeTestPlayer()
	if p.EffectiveSTR() != 10 {
		t.Errorf("Expected STR=10, got %d", p.EffectiveSTR())
	}

	// Add STR buff
	p.Buffs.AddBuff(31, "Strength", 1, 5, 60)
	if p.EffectiveSTR() != 15 {
		t.Errorf("Expected buffed STR=15, got %d", p.EffectiveSTR())
	}

	// Add debuff
	p.Buffs.AddBuff(41, "Weaken", 1, -3, 30)
	if p.EffectiveSTR() != 12 {
		t.Errorf("Expected STR with buff+debuff=12, got %d", p.EffectiveSTR())
	}

	// Other stats should not be affected
	if p.EffectiveVIT() != 12 {
		t.Errorf("VIT should be unaffected, got %d", p.EffectiveVIT())
	}
	if p.EffectiveDEX() != 10 {
		t.Errorf("DEX should be unaffected, got %d", p.EffectiveDEX())
	}
	if p.EffectiveINT() != 15 {
		t.Errorf("INT should be unaffected, got %d", p.EffectiveINT())
	}
	if p.EffectiveMAG() != 20 {
		t.Errorf("MAG should be unaffected, got %d", p.EffectiveMAG())
	}
}

func TestCanCastSpell(t *testing.T) {
	p := makeTestPlayer()

	// Energy Bolt: req level 1, MAG 10, cost 8 mana
	eb := magic.GetSpellDef(1)

	// Not learned
	can, reason := p.CanCastSpell(eb)
	if can {
		t.Error("Should not cast unlearned spell")
	}
	if reason != "You haven't learned this spell" {
		t.Errorf("Expected unlearned reason, got: %s", reason)
	}

	// Learn it
	p.LearnSpell(1)
	can, _ = p.CanCastSpell(eb)
	if !can {
		t.Error("Should be able to cast Energy Bolt")
	}

	// Drain mana
	p.MP = 3
	can, reason = p.CanCastSpell(eb)
	if can {
		t.Error("Should not cast with insufficient mana")
	}
	if reason != "Not enough mana" {
		t.Errorf("Expected mana reason, got: %s", reason)
	}

	// Restore mana, set cooldown
	p.MP = 50
	p.StartCooldown(1, 5000)
	can, reason = p.CanCastSpell(eb)
	if can {
		t.Error("Should not cast on cooldown")
	}
	if reason != "Spell is on cooldown" {
		t.Errorf("Expected cooldown reason, got: %s", reason)
	}
}

func TestCanCastSpellDead(t *testing.T) {
	p := makeTestPlayer()
	p.LearnSpell(1)
	p.HP = 0

	can, reason := p.CanCastSpell(magic.GetSpellDef(1))
	if can {
		t.Error("Dead player should not cast")
	}
	if reason != "You are dead" {
		t.Errorf("Expected dead reason, got: %s", reason)
	}
}

func TestCanCastSpellRequirements(t *testing.T) {
	p := makeTestPlayer()
	p.Level = 5 // Below fireball req

	// Fireball: req level 10, MAG 18, INT 14
	fb := magic.GetSpellDef(3)
	p.LearnSpell(3)

	can, reason := p.CanCastSpell(fb)
	if can {
		t.Error("Level 5 should not cast Fireball")
	}
	if reason != "Your level is too low" {
		t.Errorf("Expected level reason, got: %s", reason)
	}
}

func TestLearnSpell(t *testing.T) {
	p := makeTestPlayer()
	if !p.LearnSpell(1) {
		t.Error("Should learn new spell")
	}
	if p.LearnSpell(1) {
		t.Error("Should not re-learn spell")
	}
}

func TestStartCooldown(t *testing.T) {
	p := makeTestPlayer()
	p.StartCooldown(1, 2000)

	cd, exists := p.Cooldowns[1]
	if !exists {
		t.Fatal("Cooldown should exist")
	}
	if time.Until(cd) < 1*time.Second {
		t.Error("Cooldown should be ~2 seconds in future")
	}
}

func TestToSpellList(t *testing.T) {
	p := makeTestPlayer()
	p.LearnSpell(1) // Energy Bolt
	p.LearnSpell(20) // Heal

	list := p.ToSpellList()
	if len(list.Spells) != 2 {
		t.Errorf("Expected 2 spells, got %d", len(list.Spells))
	}
}

func TestToSkillList(t *testing.T) {
	p := makeTestPlayer()
	p.Skills.SetMastery(1, 50) // Attack
	p.Skills.SetMastery(2, 30) // Magic

	list := p.ToSkillList()
	if list.MasteryCap != 700 {
		t.Errorf("Expected cap=700, got %d", list.MasteryCap)
	}
	if list.TotalMastery != 80 {
		t.Errorf("Expected total=80, got %d", list.TotalMastery)
	}
}

func TestFromDBInitializesNewFields(t *testing.T) {
	row := &db.CharacterRow{
		ID: 1, AccountID: 1, Name: "Test", Level: 1,
		STR: 10, VIT: 10, DEX: 10, INT: 10, MAG: 10, CHR: 10,
		HP: 30, MP: 10, SP: 30, MapName: "default",
	}
	p := FromDB(row, 1, nil)

	if p.Skills == nil {
		t.Error("Skills should be initialized")
	}
	if p.LearnedSpells == nil {
		t.Error("LearnedSpells should be initialized")
	}
	if p.Buffs == nil {
		t.Error("Buffs should be initialized")
	}
	if p.Cooldowns == nil {
		t.Error("Cooldowns should be initialized")
	}
}
