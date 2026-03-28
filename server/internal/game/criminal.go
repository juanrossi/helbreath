package game

// CriminalStatus holds the criminal tier information for a player based on their PK count.
// Tier thresholds are ported from the original Helbreath criminal system.
type CriminalStatus struct {
	Tier    int    // 0=innocent, 1=suspect, 2=criminal, 3=murderer, 4=slaughterer
	Name    string // display name
	PKCount int
}

// Criminal tier constants.
const (
	CriminalTierInnocent    = 0
	CriminalTierSuspect     = 1
	CriminalTierCriminal    = 2
	CriminalTierMurderer    = 3
	CriminalTierSlaughterer = 4
)

// GetCriminalStatus returns the criminal status for a given PK count.
//
//	0 PK       = Innocent
//	1-2 PK     = Suspect
//	3-7 PK     = Criminal
//	8-11 PK    = Murderer
//	12+ PK     = Slaughterer
func GetCriminalStatus(pkCount int) CriminalStatus {
	switch {
	case pkCount <= 0:
		return CriminalStatus{Tier: CriminalTierInnocent, Name: "Innocent", PKCount: pkCount}
	case pkCount <= 2:
		return CriminalStatus{Tier: CriminalTierSuspect, Name: "Suspect", PKCount: pkCount}
	case pkCount <= 7:
		return CriminalStatus{Tier: CriminalTierCriminal, Name: "Criminal", PKCount: pkCount}
	case pkCount <= 11:
		return CriminalStatus{Tier: CriminalTierMurderer, Name: "Murderer", PKCount: pkCount}
	default:
		return CriminalStatus{Tier: CriminalTierSlaughterer, Name: "Slaughterer", PKCount: pkCount}
	}
}

// IsCriminal returns true if the PK count qualifies as criminal or worse (3+ PKs).
func IsCriminal(pkCount int) bool {
	return pkCount >= 3
}
