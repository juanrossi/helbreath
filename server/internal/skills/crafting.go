package skills

// Recipe defines a crafting recipe.
type Recipe struct {
	ID         int
	Name       string
	Skill      SkillID // which crafting skill is used
	ReqMastery int     // minimum mastery required
	Inputs     []RecipeInput
	OutputID   int // item definition ID produced
	OutputCount int
}

// RecipeInput is a required ingredient.
type RecipeInput struct {
	ItemID int
	Count  int
}

// RecipeDB holds all crafting recipes.
var RecipeDB = map[int]*Recipe{}

// GetRecipe returns a recipe by ID.
func GetRecipe(id int) *Recipe {
	return RecipeDB[id]
}

func init() {
	// === ALCHEMY RECIPES ===
	RecipeDB[1] = &Recipe{
		ID: 1, Name: "Small HP Potion", Skill: SkillAlchemy, ReqMastery: 0,
		Inputs:      []RecipeInput{{ItemID: 200, Count: 2}}, // 2x Red Herb
		OutputID:    100, OutputCount: 1,
	}
	RecipeDB[2] = &Recipe{
		ID: 2, Name: "Medium HP Potion", Skill: SkillAlchemy, ReqMastery: 20,
		Inputs:      []RecipeInput{{ItemID: 200, Count: 3}, {ItemID: 100, Count: 1}}, // 3x Red Herb + Small HP Pot
		OutputID:    101, OutputCount: 1,
	}
	RecipeDB[3] = &Recipe{
		ID: 3, Name: "Large HP Potion", Skill: SkillAlchemy, ReqMastery: 40,
		Inputs:      []RecipeInput{{ItemID: 200, Count: 5}, {ItemID: 101, Count: 1}}, // 5x Red Herb + Med HP Pot
		OutputID:    102, OutputCount: 1,
	}
	RecipeDB[4] = &Recipe{
		ID: 4, Name: "Small MP Potion", Skill: SkillAlchemy, ReqMastery: 0,
		Inputs:      []RecipeInput{{ItemID: 201, Count: 2}}, // 2x Blue Herb
		OutputID:    103, OutputCount: 1,
	}
	RecipeDB[5] = &Recipe{
		ID: 5, Name: "Medium MP Potion", Skill: SkillAlchemy, ReqMastery: 20,
		Inputs:      []RecipeInput{{ItemID: 201, Count: 3}, {ItemID: 103, Count: 1}}, // 3x Blue Herb + Small MP Pot
		OutputID:    104, OutputCount: 1,
	}
	RecipeDB[6] = &Recipe{
		ID: 6, Name: "Large MP Potion", Skill: SkillAlchemy, ReqMastery: 40,
		Inputs:      []RecipeInput{{ItemID: 201, Count: 5}, {ItemID: 104, Count: 1}}, // 5x Blue Herb + Med MP Pot
		OutputID:    105, OutputCount: 1,
	}

	// === BLACKSMITHING RECIPES ===
	RecipeDB[10] = &Recipe{
		ID: 10, Name: "Short Sword", Skill: SkillBlacksmith, ReqMastery: 0,
		Inputs:      []RecipeInput{{ItemID: 210, Count: 3}}, // 3x Iron Ore
		OutputID:    1, OutputCount: 1,
	}
	RecipeDB[11] = &Recipe{
		ID: 11, Name: "Long Sword", Skill: SkillBlacksmith, ReqMastery: 20,
		Inputs:      []RecipeInput{{ItemID: 210, Count: 5}}, // 5x Iron Ore
		OutputID:    2, OutputCount: 1,
	}
	RecipeDB[12] = &Recipe{
		ID: 12, Name: "Battle Axe", Skill: SkillBlacksmith, ReqMastery: 30,
		Inputs:      []RecipeInput{{ItemID: 210, Count: 6}, {ItemID: 211, Count: 1}}, // 6x Iron Ore + 1x Coal
		OutputID:    3, OutputCount: 1,
	}
	RecipeDB[13] = &Recipe{
		ID: 13, Name: "Leather Cap", Skill: SkillBlacksmith, ReqMastery: 5,
		Inputs:      []RecipeInput{{ItemID: 212, Count: 2}}, // 2x Leather
		OutputID:    30, OutputCount: 1,
	}
	RecipeDB[14] = &Recipe{
		ID: 14, Name: "Leather Armor", Skill: SkillBlacksmith, ReqMastery: 10,
		Inputs:      []RecipeInput{{ItemID: 212, Count: 4}}, // 4x Leather
		OutputID:    40, OutputCount: 1,
	}

	// === COOKING RECIPES ===
	RecipeDB[20] = &Recipe{
		ID: 20, Name: "Grilled Fish", Skill: SkillCooking, ReqMastery: 0,
		Inputs:      []RecipeInput{{ItemID: 220, Count: 1}}, // 1x Raw Fish
		OutputID:    106, OutputCount: 1,
	}
	RecipeDB[21] = &Recipe{
		ID: 21, Name: "Stamina Stew", Skill: SkillCooking, ReqMastery: 15,
		Inputs:      []RecipeInput{{ItemID: 220, Count: 2}, {ItemID: 200, Count: 1}}, // 2x Raw Fish + 1x Red Herb
		OutputID:    107, OutputCount: 1,
	}
}
