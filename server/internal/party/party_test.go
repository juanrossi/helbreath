package party

import (
	"testing"
)

func TestNewParty(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	if p.ID != 1 || p.LeaderID != 100 {
		t.Fatal("unexpected party fields")
	}
	if p.MemberCount() != 1 {
		t.Fatal("expected 1 member")
	}
}

func TestAddMember(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	if err := p.AddMember(101, "Player1", 40, 80, 8); err != nil {
		t.Fatal(err)
	}
	if p.MemberCount() != 2 {
		t.Fatal("expected 2 members")
	}
}

func TestAddMemberFull(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	for i := int32(1); i < MaxPartySize; i++ {
		p.AddMember(100+i, "P", 50, 100, 10)
	}
	err := p.AddMember(200, "Extra", 50, 100, 10)
	if err == nil {
		t.Fatal("expected error when party is full")
	}
}

func TestAddMemberDuplicate(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	err := p.AddMember(100, "Leader", 50, 100, 10)
	if err == nil {
		t.Fatal("expected error for duplicate member")
	}
}

func TestRemoveMember(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	p.AddMember(101, "P1", 40, 80, 8)
	if err := p.RemoveMember(101); err != nil {
		t.Fatal(err)
	}
	if p.MemberCount() != 1 {
		t.Fatal("expected 1 member after removal")
	}
}

func TestRemoveLeaderReassigns(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	p.AddMember(101, "P1", 40, 80, 8)
	p.AddMember(102, "P2", 40, 80, 8)
	p.RemoveMember(100)
	if p.LeaderID == 100 {
		t.Fatal("leader should have been reassigned")
	}
	if !p.HasMember(p.LeaderID) {
		t.Fatal("new leader should be in party")
	}
}

func TestRemoveNonMember(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	err := p.RemoveMember(999)
	if err == nil {
		t.Fatal("expected error removing non-member")
	}
}

func TestIsLeader(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	p.AddMember(101, "P1", 40, 80, 8)
	if !p.IsLeader(100) {
		t.Fatal("100 should be leader")
	}
	if p.IsLeader(101) {
		t.Fatal("101 should not be leader")
	}
}

func TestHasMember(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	if !p.HasMember(100) {
		t.Fatal("expected leader to be member")
	}
	if p.HasMember(999) {
		t.Fatal("expected 999 to not be member")
	}
}

func TestGetMemberIDs(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	p.AddMember(101, "P1", 40, 80, 8)
	ids := p.GetMemberIDs()
	if len(ids) != 2 {
		t.Fatalf("expected 2 IDs, got %d", len(ids))
	}
}

func TestGetMembers(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	p.AddMember(101, "P1", 40, 80, 8)
	members := p.GetMembers()
	if len(members) != 2 {
		t.Fatalf("expected 2 members, got %d", len(members))
	}
}

func TestUpdateMemberStats(t *testing.T) {
	p := NewParty(1, 100, "Leader", 50, 100, 10)
	p.UpdateMemberStats(100, 80, 120, 15)
	members := p.GetMembers()
	for _, m := range members {
		if m.ObjectID == 100 {
			if m.HP != 80 || m.MaxHP != 120 || m.Level != 15 {
				t.Fatal("stats not updated")
			}
			return
		}
	}
	t.Fatal("leader not found")
}

// PartyManager tests

func TestManagerCreateParty(t *testing.T) {
	pm := NewPartyManager()
	p := pm.CreateParty(100, "Leader", 50, 100, 10)
	if p == nil {
		t.Fatal("expected party")
	}
	if pm.GetPlayerParty(100) == nil {
		t.Fatal("expected player to be in party")
	}
}

func TestManagerInviteAccept(t *testing.T) {
	pm := NewPartyManager()
	pm.CreateParty(100, "Leader", 50, 100, 10)
	if err := pm.InvitePlayer(100, 101); err != nil {
		t.Fatal(err)
	}
	if !pm.HasPendingInvite(101) {
		t.Fatal("expected pending invite")
	}
	p, err := pm.AcceptInvite(101, "Player1", 40, 80, 8)
	if err != nil {
		t.Fatal(err)
	}
	if p.MemberCount() != 2 {
		t.Fatal("expected 2 members")
	}
}

func TestManagerDeclineInvite(t *testing.T) {
	pm := NewPartyManager()
	pm.CreateParty(100, "Leader", 50, 100, 10)
	pm.InvitePlayer(100, 101)
	pm.DeclineInvite(101)
	if pm.HasPendingInvite(101) {
		t.Fatal("expected no pending invite")
	}
}

func TestManagerLeaveParty(t *testing.T) {
	pm := NewPartyManager()
	pm.CreateParty(100, "Leader", 50, 100, 10)
	pm.InvitePlayer(100, 101)
	pm.AcceptInvite(101, "P1", 40, 80, 8)
	pm.InvitePlayer(100, 102)
	pm.AcceptInvite(102, "P2", 40, 80, 8)

	if err := pm.LeaveParty(101); err != nil {
		t.Fatal(err)
	}
	if pm.GetPlayerParty(101) != nil {
		t.Fatal("expected player to not be in party")
	}
}

func TestManagerLeaveDisbands(t *testing.T) {
	pm := NewPartyManager()
	pm.CreateParty(100, "Leader", 50, 100, 10)
	pm.InvitePlayer(100, 101)
	pm.AcceptInvite(101, "P1", 40, 80, 8)

	// When one leaves a 2-member party, the party should disband
	pm.LeaveParty(101)
	if pm.GetPlayerParty(100) != nil {
		t.Fatal("expected party to be disbanded")
	}
}

func TestManagerKick(t *testing.T) {
	pm := NewPartyManager()
	pm.CreateParty(100, "Leader", 50, 100, 10)
	pm.InvitePlayer(100, 101)
	pm.AcceptInvite(101, "P1", 40, 80, 8)
	pm.InvitePlayer(100, 102)
	pm.AcceptInvite(102, "P2", 40, 80, 8)

	if err := pm.KickMember(100, 101); err != nil {
		t.Fatal(err)
	}
	if pm.GetPlayerParty(101) != nil {
		t.Fatal("kicked player should not be in party")
	}
}

func TestManagerKickNotLeader(t *testing.T) {
	pm := NewPartyManager()
	pm.CreateParty(100, "Leader", 50, 100, 10)
	pm.InvitePlayer(100, 101)
	pm.AcceptInvite(101, "P1", 40, 80, 8)

	err := pm.KickMember(101, 100)
	if err == nil {
		t.Fatal("expected error: non-leader cannot kick")
	}
}

func TestManagerInviteAlreadyInParty(t *testing.T) {
	pm := NewPartyManager()
	pm.CreateParty(100, "Leader", 50, 100, 10)
	pm.InvitePlayer(100, 101)
	pm.AcceptInvite(101, "P1", 40, 80, 8)

	err := pm.InvitePlayer(100, 101)
	if err == nil {
		t.Fatal("expected error: player already in party")
	}
}
