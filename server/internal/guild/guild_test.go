package guild

import (
	"testing"
)

func TestNewGuild(t *testing.T) {
	g := NewGuild(1, "TestGuild", 1, 100, "Master", 25)
	if g.ID != 1 || g.Name != "TestGuild" || g.Side != 1 || g.MasterID != 100 {
		t.Fatal("unexpected guild fields")
	}
	if len(g.Members) != 1 {
		t.Fatal("expected 1 member (master)")
	}
	m := g.Members[100]
	if m.Name != "Master" || m.Rank != RankMaster || m.Level != 25 {
		t.Fatal("unexpected master member fields")
	}
}

func TestAddMember(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	if err := g.AddMember(101, "Player1", 15); err != nil {
		t.Fatal(err)
	}
	if g.MemberCount() != 2 {
		t.Fatal("expected 2 members")
	}
	m := g.GetMember(101)
	if m == nil || m.Rank != RankMember {
		t.Fatal("expected member with rank 1")
	}
}

func TestAddMemberDuplicate(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	g.AddMember(101, "P1", 15)
	err := g.AddMember(101, "P1", 15)
	if err == nil {
		t.Fatal("expected error for duplicate member")
	}
}

func TestAddMemberFull(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	for i := 1; i < MaxMembers; i++ {
		g.AddMember(100+i, "P", 10)
	}
	err := g.AddMember(999, "Extra", 10)
	if err == nil {
		t.Fatal("expected error when guild is full")
	}
}

func TestRemoveMember(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	g.AddMember(101, "P1", 15)
	if err := g.RemoveMember(101); err != nil {
		t.Fatal(err)
	}
	if g.MemberCount() != 1 {
		t.Fatal("expected 1 member after removal")
	}
}

func TestRemoveMaster(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	err := g.RemoveMember(100)
	if err == nil {
		t.Fatal("expected error removing guild master")
	}
}

func TestPromote(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	g.AddMember(101, "P1", 15)
	if err := g.Promote(101); err != nil {
		t.Fatal(err)
	}
	m := g.GetMember(101)
	if m.Rank != RankOfficer {
		t.Fatal("expected officer rank")
	}
}

func TestPromoteAlreadyOfficer(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	g.AddMember(101, "P1", 15)
	g.Promote(101)
	err := g.Promote(101)
	if err == nil {
		t.Fatal("expected error promoting already officer")
	}
}

func TestDemote(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	g.AddMember(101, "P1", 15)
	g.Promote(101)
	if err := g.Demote(101); err != nil {
		t.Fatal(err)
	}
	m := g.GetMember(101)
	if m.Rank != RankMember {
		t.Fatal("expected member rank")
	}
}

func TestDemoteNonOfficer(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	g.AddMember(101, "P1", 15)
	err := g.Demote(101)
	if err == nil {
		t.Fatal("expected error demoting non-officer")
	}
}

func TestSetOnline(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	g.SetOnline(100, false)
	m := g.GetMember(100)
	if m.Online {
		t.Fatal("expected offline")
	}
	g.SetOnline(100, true)
	m = g.GetMember(100)
	if !m.Online {
		t.Fatal("expected online")
	}
}

func TestMemberList(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Master", 20)
	g.AddMember(101, "P1", 15)
	g.AddMember(102, "P2", 18)
	list := g.MemberList()
	if len(list) != 3 {
		t.Fatalf("expected 3 members, got %d", len(list))
	}
}

func TestGetMasterName(t *testing.T) {
	g := NewGuild(1, "G", 1, 100, "Leader", 20)
	if g.GetMasterName() != "Leader" {
		t.Fatal("unexpected master name")
	}
}

// Registry tests

func TestRegistryCreateGuild(t *testing.T) {
	r := NewGuildRegistry()
	g, err := r.CreateGuild("TestGuild", 1, 100, "Master", 20)
	if err != nil {
		t.Fatal(err)
	}
	if g.Name != "TestGuild" || g.ID != 1 {
		t.Fatal("unexpected guild")
	}
}

func TestRegistryDuplicateName(t *testing.T) {
	r := NewGuildRegistry()
	r.CreateGuild("MyGuild", 1, 100, "M1", 20)
	_, err := r.CreateGuild("MyGuild", 2, 200, "M2", 20)
	if err == nil {
		t.Fatal("expected error for duplicate guild name")
	}
}

func TestRegistryAlreadyInGuild(t *testing.T) {
	r := NewGuildRegistry()
	r.CreateGuild("G1", 1, 100, "M1", 20)
	_, err := r.CreateGuild("G2", 1, 100, "M1", 20)
	if err == nil {
		t.Fatal("expected error: master already in a guild")
	}
}

func TestRegistryJoinGuild(t *testing.T) {
	r := NewGuildRegistry()
	g, _ := r.CreateGuild("G1", 1, 100, "Master", 20)
	err := r.JoinGuild(g.ID, 101, "Player1", 15)
	if err != nil {
		t.Fatal(err)
	}
	if r.GetPlayerGuild(101) == nil {
		t.Fatal("expected player to be in guild")
	}
}

func TestRegistryLeaveGuild(t *testing.T) {
	r := NewGuildRegistry()
	g, _ := r.CreateGuild("G1", 1, 100, "Master", 20)
	r.JoinGuild(g.ID, 101, "P1", 15)
	err := r.LeaveGuild(101)
	if err != nil {
		t.Fatal(err)
	}
	if r.GetPlayerGuild(101) != nil {
		t.Fatal("expected player to not be in guild")
	}
}

func TestRegistryDisbandGuild(t *testing.T) {
	r := NewGuildRegistry()
	g, _ := r.CreateGuild("G1", 1, 100, "Master", 20)
	r.JoinGuild(g.ID, 101, "P1", 15)
	err := r.DisbandGuild(g.ID, 100)
	if err != nil {
		t.Fatal(err)
	}
	if r.GetGuild(g.ID) != nil {
		t.Fatal("expected guild to be gone")
	}
	if r.GetPlayerGuild(100) != nil {
		t.Fatal("expected master not in guild")
	}
	if r.GetPlayerGuild(101) != nil {
		t.Fatal("expected member not in guild")
	}
}

func TestRegistryDisbandNotMaster(t *testing.T) {
	r := NewGuildRegistry()
	g, _ := r.CreateGuild("G1", 1, 100, "Master", 20)
	r.JoinGuild(g.ID, 101, "P1", 15)
	err := r.DisbandGuild(g.ID, 101)
	if err == nil {
		t.Fatal("expected error: non-master cannot disband")
	}
}

func TestRegistryGetByName(t *testing.T) {
	r := NewGuildRegistry()
	r.CreateGuild("Alpha", 1, 100, "M", 20)
	g := r.GetGuildByName("Alpha")
	if g == nil || g.Name != "Alpha" {
		t.Fatal("expected to find guild by name")
	}
	if r.GetGuildByName("Nonexistent") != nil {
		t.Fatal("expected nil for nonexistent guild")
	}
}
