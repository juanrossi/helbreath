package world

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

// Time of day phases
const (
	DayPhase   = 0
	DuskPhase  = 1
	NightPhase = 2
	DawnPhase  = 3
)

// Weather types
const (
	WeatherClear = 0
	WeatherRain  = 1
	WeatherSnow  = 2
	WeatherFog   = 3
)

// DayCycleDuration is the total length of a game day in real time.
const DayCycleDuration = 30 * time.Minute

// PhaseNames maps phase constants to display names.
var PhaseNames = map[int]string{
	DayPhase:   "Day",
	DuskPhase:  "Dusk",
	NightPhase: "Night",
	DawnPhase:  "Dawn",
}

// WeatherNames maps weather constants to display names.
var WeatherNames = map[int]string{
	WeatherClear: "Clear",
	WeatherRain:  "Rain",
	WeatherSnow:  "Snow",
	WeatherFog:   "Fog",
}

// WorldState tracks global game state (day/night, weather, events).
type WorldState struct {
	startTime time.Time
	weather   int
	weatherEnd time.Time
	mu        sync.RWMutex
}

// NewWorldState creates a new world state.
func NewWorldState() *WorldState {
	return &WorldState{
		startTime: time.Now(),
		weather:   WeatherClear,
	}
}

// GetTimeOfDay returns the current time-of-day phase.
// Day cycle: 0-40% = Day, 40-50% = Dusk, 50-90% = Night, 90-100% = Dawn
func (ws *WorldState) GetTimeOfDay() int {
	elapsed := time.Since(ws.startTime)
	cyclePos := float64(elapsed%DayCycleDuration) / float64(DayCycleDuration)

	switch {
	case cyclePos < 0.40:
		return DayPhase
	case cyclePos < 0.50:
		return DuskPhase
	case cyclePos < 0.90:
		return NightPhase
	default:
		return DawnPhase
	}
}

// GetTimeOfDayAt returns the phase for a specific time.
func (ws *WorldState) GetTimeOfDayAt(t time.Time) int {
	elapsed := t.Sub(ws.startTime)
	cyclePos := float64(elapsed%DayCycleDuration) / float64(DayCycleDuration)

	switch {
	case cyclePos < 0.40:
		return DayPhase
	case cyclePos < 0.50:
		return DuskPhase
	case cyclePos < 0.90:
		return NightPhase
	default:
		return DawnPhase
	}
}

// GetDayProgress returns a float 0.0-1.0 representing position in the day cycle.
func (ws *WorldState) GetDayProgress() float64 {
	elapsed := time.Since(ws.startTime)
	return float64(elapsed%DayCycleDuration) / float64(DayCycleDuration)
}

// GetWeather returns the current weather.
func (ws *WorldState) GetWeather() int {
	ws.mu.RLock()
	defer ws.mu.RUnlock()
	if time.Now().After(ws.weatherEnd) {
		return WeatherClear
	}
	return ws.weather
}

// SetWeather sets the weather for a duration.
func (ws *WorldState) SetWeather(weather int, duration time.Duration) {
	ws.mu.Lock()
	defer ws.mu.Unlock()
	ws.weather = weather
	ws.weatherEnd = time.Now().Add(duration)
}

// RandomWeather randomly changes weather with a probability.
// Call this periodically (e.g., every minute).
func (ws *WorldState) RandomWeather() bool {
	ws.mu.Lock()
	defer ws.mu.Unlock()

	// If weather is active, don't change
	if time.Now().Before(ws.weatherEnd) {
		return false
	}

	// 10% chance of weather change per check
	if rand.Intn(10) != 0 {
		return false
	}

	// Pick random weather
	weathers := []int{WeatherRain, WeatherSnow, WeatherFog}
	ws.weather = weathers[rand.Intn(len(weathers))]
	// Duration: 3-8 minutes
	duration := time.Duration(3+rand.Intn(6)) * time.Minute
	ws.weatherEnd = time.Now().Add(duration)
	return true
}

// IsNight returns true if it's currently night time.
func (ws *WorldState) IsNight() bool {
	phase := ws.GetTimeOfDay()
	return phase == NightPhase || phase == DuskPhase
}

// GetLightLevel returns a light level from 0.0 (darkest) to 1.0 (brightest).
func (ws *WorldState) GetLightLevel() float64 {
	phase := ws.GetTimeOfDay()
	switch phase {
	case DayPhase:
		return 1.0
	case DuskPhase:
		return 0.6
	case NightPhase:
		return 0.3
	case DawnPhase:
		return 0.7
	default:
		return 1.0
	}
}

// Arena/Event state

// EventState tracks active server events.
type EventState struct {
	CrusadeActive  bool
	CrusadeSide1   int // score
	CrusadeSide2   int // score
	ArenaOpen      bool
	ArenaPlayers   map[int32]bool // object IDs in arena
	mu             sync.RWMutex
}

// NewEventState creates a new event state.
func NewEventState() *EventState {
	return &EventState{
		ArenaPlayers: make(map[int32]bool),
	}
}

// StartCrusade begins a crusade event.
func (es *EventState) StartCrusade() {
	es.mu.Lock()
	defer es.mu.Unlock()
	es.CrusadeActive = true
	es.CrusadeSide1 = 0
	es.CrusadeSide2 = 0
}

// EndCrusade ends the crusade.
func (es *EventState) EndCrusade() int {
	es.mu.Lock()
	defer es.mu.Unlock()
	es.CrusadeActive = false
	if es.CrusadeSide1 > es.CrusadeSide2 {
		return 1
	}
	if es.CrusadeSide2 > es.CrusadeSide1 {
		return 2
	}
	return 0 // draw
}

// AddCrusadePoints adds score to a faction.
func (es *EventState) AddCrusadePoints(side int, points int) {
	es.mu.Lock()
	defer es.mu.Unlock()
	if side == 1 {
		es.CrusadeSide1 += points
	} else if side == 2 {
		es.CrusadeSide2 += points
	}
}

// IsCrusadeActive returns whether a crusade is active.
func (es *EventState) IsCrusadeActive() bool {
	es.mu.RLock()
	defer es.mu.RUnlock()
	return es.CrusadeActive
}

// OpenArena opens the arena for entry.
func (es *EventState) OpenArena() {
	es.mu.Lock()
	defer es.mu.Unlock()
	es.ArenaOpen = true
}

// CloseArena closes the arena.
func (es *EventState) CloseArena() {
	es.mu.Lock()
	defer es.mu.Unlock()
	es.ArenaOpen = false
	es.ArenaPlayers = make(map[int32]bool)
}

// JoinArena adds a player to the arena.
func (es *EventState) JoinArena(objectID int32) error {
	es.mu.Lock()
	defer es.mu.Unlock()
	if !es.ArenaOpen {
		return fmt.Errorf("arena is not open")
	}
	es.ArenaPlayers[objectID] = true
	return nil
}

// LeaveArena removes a player from the arena.
func (es *EventState) LeaveArena(objectID int32) {
	es.mu.Lock()
	defer es.mu.Unlock()
	delete(es.ArenaPlayers, objectID)
}

// IsInArena checks if a player is in the arena.
func (es *EventState) IsInArena(objectID int32) bool {
	es.mu.RLock()
	defer es.mu.RUnlock()
	return es.ArenaPlayers[objectID]
}

// ArenaPlayerCount returns the number of arena participants.
func (es *EventState) ArenaPlayerCount() int {
	es.mu.RLock()
	defer es.mu.RUnlock()
	return len(es.ArenaPlayers)
}
