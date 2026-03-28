package game

import "math/rand"

// iDice rolls n dice each with 'sides' faces and returns the sum.
// This is the core randomizer ported from the C++ Helbreath server.
func iDice(n, sides int) int {
	if n <= 0 || sides <= 0 {
		return 0
	}
	total := 0
	for i := 0; i < n; i++ {
		total += rand.Intn(sides) + 1
	}
	return total
}

// clamp constrains v to the range [lo, hi].
func clamp(v, lo, hi int) int {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}
