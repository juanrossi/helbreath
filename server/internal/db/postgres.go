package db

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Connect creates a pgxpool with production-ready defaults.
// Pool size and timeouts can be overridden via the connection URL query params:
//   - pool_max_conns=50
//   - pool_min_conns=5
//   - pool_max_conn_lifetime=30m
//   - pool_max_conn_idle_time=5m
//   - pool_health_check_period=30s
func Connect(ctx context.Context, dbURL string) (*pgxpool.Pool, error) {
	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		return nil, err
	}

	// Sensible defaults — overridden if already set via URL params
	if config.MaxConns == 0 || config.MaxConns == 4 { // 4 is pgxpool's internal default
		config.MaxConns = 50
	}
	if config.MinConns == 0 {
		config.MinConns = 5
	}
	if config.MaxConnLifetime == 0 {
		config.MaxConnLifetime = 30 * time.Minute
	}
	if config.MaxConnIdleTime == 0 {
		config.MaxConnIdleTime = 5 * time.Minute
	}
	if config.HealthCheckPeriod == 0 {
		config.HealthCheckPeriod = 30 * time.Second
	}

	return pgxpool.NewWithConfig(ctx, config)
}
