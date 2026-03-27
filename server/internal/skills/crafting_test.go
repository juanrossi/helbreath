package skills

import "testing"

func TestGetRecipe(t *testing.T) {
	recipe := GetRecipe(1)
	if recipe == nil {
		t.Fatal("Expected to find recipe 1")
	}
	if recipe.Name != "Small HP Potion" {
		t.Errorf("Expected name=Small HP Potion, got %s", recipe.Name)
	}
	if recipe.Skill != SkillAlchemy {
		t.Errorf("Expected skill=Alchemy, got %d", recipe.Skill)
	}
	if recipe.OutputID != 100 {
		t.Errorf("Expected output=100, got %d", recipe.OutputID)
	}
}

func TestGetRecipeNotFound(t *testing.T) {
	if GetRecipe(999) != nil {
		t.Error("Expected nil for non-existent recipe")
	}
}

func TestRecipeInputs(t *testing.T) {
	// Battle Axe recipe needs 6 Iron Ore + 1 Coal
	recipe := GetRecipe(12)
	if recipe == nil {
		t.Fatal("Recipe 12 not found")
	}
	if len(recipe.Inputs) != 2 {
		t.Fatalf("Expected 2 inputs, got %d", len(recipe.Inputs))
	}
	if recipe.Inputs[0].ItemID != 210 || recipe.Inputs[0].Count != 6 {
		t.Errorf("Expected input 0: ItemID=210 Count=6, got ItemID=%d Count=%d",
			recipe.Inputs[0].ItemID, recipe.Inputs[0].Count)
	}
	if recipe.Inputs[1].ItemID != 211 || recipe.Inputs[1].Count != 1 {
		t.Errorf("Expected input 1: ItemID=211 Count=1, got ItemID=%d Count=%d",
			recipe.Inputs[1].ItemID, recipe.Inputs[1].Count)
	}
}

func TestRecipeMasteryRequirements(t *testing.T) {
	tests := []struct {
		id         int
		name       string
		reqMastery int
	}{
		{1, "Small HP Potion", 0},
		{2, "Medium HP Potion", 20},
		{3, "Large HP Potion", 40},
		{10, "Short Sword", 0},
		{11, "Long Sword", 20},
		{12, "Battle Axe", 30},
	}

	for _, tt := range tests {
		recipe := GetRecipe(tt.id)
		if recipe == nil {
			t.Errorf("Recipe %d not found", tt.id)
			continue
		}
		if recipe.ReqMastery != tt.reqMastery {
			t.Errorf("Recipe %s: expected req mastery=%d, got %d", tt.name, tt.reqMastery, recipe.ReqMastery)
		}
	}
}

func TestRecipeCategories(t *testing.T) {
	// Alchemy recipes (IDs 1-6)
	for i := 1; i <= 6; i++ {
		recipe := GetRecipe(i)
		if recipe == nil {
			continue
		}
		if recipe.Skill != SkillAlchemy {
			t.Errorf("Recipe %d should be Alchemy, got %d", i, recipe.Skill)
		}
	}

	// Blacksmithing recipes (IDs 10-14)
	for i := 10; i <= 14; i++ {
		recipe := GetRecipe(i)
		if recipe == nil {
			continue
		}
		if recipe.Skill != SkillBlacksmith {
			t.Errorf("Recipe %d should be Blacksmithing, got %d", i, recipe.Skill)
		}
	}

	// Cooking recipes (IDs 20-21)
	for i := 20; i <= 21; i++ {
		recipe := GetRecipe(i)
		if recipe == nil {
			continue
		}
		if recipe.Skill != SkillCooking {
			t.Errorf("Recipe %d should be Cooking, got %d", i, recipe.Skill)
		}
	}
}

func TestRecipeDBCount(t *testing.T) {
	if len(RecipeDB) < 10 {
		t.Errorf("Expected at least 10 recipes, got %d", len(RecipeDB))
	}
}
