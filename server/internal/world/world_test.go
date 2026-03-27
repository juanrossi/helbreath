package world

import (
	"testing"
	"time"
)

func TestNewWorldState(t *testing.T) {
	ws := NewWorldState()
	if ws == nil {
		t.Fatal("expected non-nil world state")
	}
}

func TestGetTimeOfDay(t *testing.T) {
	ws := NewWorldState()
	phase := ws.GetTimeOfDay()
	// Just started, should be Day (0-40% of cycle)
	if phase != DayPhase {
		t.Fatalf("expected Day phase at start, got %d", phase)
	}
}

func TestGetTimeOfDayAt(t *testing.T) {
	ws := NewWorldState()

	// At 20% of cycle -> Day
	dayTime := ws.startTime.Add(DayCycleDuration * 20 / 100)
	if ws.GetTimeOfDayAt(dayTime) != DayPhase {
		t.Fatal("expected Day at 20%")
	}

	// At 45% of cycle -> Dusk
	duskTime := ws.startTime.Add(DayCycleDuration * 45 / 100)
	if ws.GetTimeOfDayAt(duskTime) != DuskPhase {
		t.Fatal("expected Dusk at 45%")
	}

	// At 70% of cycle -> Night
	nightTime := ws.startTime.Add(DayCycleDuration * 70 / 100)
	if ws.GetTimeOfDayAt(nightTime) != NightPhase {
		t.Fatal("expected Night at 70%")
	}

	// At 95% of cycle -> Dawn
	dawnTime := ws.startTime.Add(DayCycleDuration * 95 / 100)
	if ws.GetTimeOfDayAt(dawnTime) != DawnPhase {
		t.Fatal("expected Dawn at 95%")
	}
}

func TestGetDayProgress(t *testing.T) {
	ws := NewWorldState()
	progress := ws.GetDayProgress()
	if progress < 0 || progress > 1 {
		t.Fatalf("expected progress 0-1, got %f", progress)
	}
}

func TestWeatherDefault(t *testing.T) {
	ws := NewWorldState()
	if ws.GetWeather() != WeatherClear {
		t.Fatal("expected clear weather by default")
	}
}

func TestSetWeather(t *testing.T) {
	ws := NewWorldState()
	ws.SetWeather(WeatherRain, 5*time.Minute)
	if ws.GetWeather() != WeatherRain {
		t.Fatal("expected rain")
	}
}

func TestWeatherExpiry(t *testing.T) {
	ws := NewWorldState()
	ws.SetWeather(WeatherSnow, 1*time.Millisecond)
	time.Sleep(2 * time.Millisecond)
	if ws.GetWeather() != WeatherClear {
		t.Fatal("expected weather to expire to clear")
	}
}

func TestIsNight(t *testing.T) {
	ws := NewWorldState()
	// At start (0% of cycle), should be day
	if ws.IsNight() {
		t.Fatal("should not be night at start")
	}
}

func TestGetLightLevel(t *testing.T) {
	ws := NewWorldState()
	light := ws.GetLightLevel()
	if light != 1.0 {
		t.Fatalf("expected 1.0 light at day, got %f", light)
	}
}

func TestPhaseNames(t *testing.T) {
	if PhaseNames[DayPhase] != "Day" {
		t.Fatal("expected 'Day'")
	}
	if PhaseNames[NightPhase] != "Night" {
		t.Fatal("expected 'Night'")
	}
}

func TestWeatherNames(t *testing.T) {
	if WeatherNames[WeatherClear] != "Clear" {
		t.Fatal("expected 'Clear'")
	}
	if WeatherNames[WeatherRain] != "Rain" {
		t.Fatal("expected 'Rain'")
	}
}

// Event tests

func TestNewEventState(t *testing.T) {
	es := NewEventState()
	if es.IsCrusadeActive() {
		t.Fatal("crusade should not be active")
	}
}

func TestCrusade(t *testing.T) {
	es := NewEventState()
	es.StartCrusade()
	if !es.IsCrusadeActive() {
		t.Fatal("crusade should be active")
	}

	es.AddCrusadePoints(1, 10)
	es.AddCrusadePoints(2, 5)
	winner := es.EndCrusade()
	if winner != 1 {
		t.Fatalf("expected side 1 to win, got %d", winner)
	}
	if es.IsCrusadeActive() {
		t.Fatal("crusade should be ended")
	}
}

func TestCrusadeDraw(t *testing.T) {
	es := NewEventState()
	es.StartCrusade()
	es.AddCrusadePoints(1, 10)
	es.AddCrusadePoints(2, 10)
	winner := es.EndCrusade()
	if winner != 0 {
		t.Fatalf("expected draw (0), got %d", winner)
	}
}

func TestArena(t *testing.T) {
	es := NewEventState()

	// Can't join when closed
	err := es.JoinArena(100)
	if err == nil {
		t.Fatal("expected error: arena closed")
	}

	es.OpenArena()
	err = es.JoinArena(100)
	if err != nil {
		t.Fatal(err)
	}
	if !es.IsInArena(100) {
		t.Fatal("expected player in arena")
	}
	if es.ArenaPlayerCount() != 1 {
		t.Fatal("expected 1 player")
	}

	es.LeaveArena(100)
	if es.IsInArena(100) {
		t.Fatal("expected player not in arena")
	}
}

func TestRandomWeatherNoChange(t *testing.T) {
	ws := NewWorldState()
	// With active weather, should not change
	ws.SetWeather(WeatherRain, 10*time.Minute)
	changed := ws.RandomWeather()
	if changed {
		t.Fatal("should not change weather while active")
	}
}

func TestCrusadeSide2Wins(t *testing.T) {
	es := NewEventState()
	es.StartCrusade()
	es.AddCrusadePoints(1, 5)
	es.AddCrusadePoints(2, 15)
	winner := es.EndCrusade()
	if winner != 2 {
		t.Fatalf("expected side 2 to win, got %d", winner)
	}
}

func TestArenaClose(t *testing.T) {
	es := NewEventState()
	es.OpenArena()
	es.JoinArena(100)
	es.JoinArena(101)
	es.CloseArena()
	if es.ArenaPlayerCount() != 0 {
		t.Fatal("expected 0 players after close")
	}
}
