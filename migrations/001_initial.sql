-- Initial schema for HB Online

CREATE TABLE accounts (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email         VARCHAR(255),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    last_login    TIMESTAMPTZ,
    is_banned     BOOLEAN DEFAULT FALSE
);

CREATE TABLE characters (
    id              SERIAL PRIMARY KEY,
    account_id      INT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name            VARCHAR(10) UNIQUE NOT NULL,
    gender          SMALLINT NOT NULL DEFAULT 0,
    skin_color      SMALLINT DEFAULT 0,
    hair_style      SMALLINT DEFAULT 0,
    hair_color      SMALLINT DEFAULT 0,
    underwear_color SMALLINT DEFAULT 0,
    side            SMALLINT DEFAULT 0,
    level           INT DEFAULT 1,
    experience      BIGINT DEFAULT 0,
    str             INT DEFAULT 10,
    vit             INT DEFAULT 10,
    dex             INT DEFAULT 10,
    int_stat        INT DEFAULT 10,
    mag             INT DEFAULT 10,
    charisma        INT DEFAULT 10,
    lu_pool         INT DEFAULT 0,
    hp              INT DEFAULT 30,
    mp              INT DEFAULT 10,
    sp              INT DEFAULT 30,
    map_name        VARCHAR(30) DEFAULT 'default',
    pos_x           INT DEFAULT 0,
    pos_y           INT DEFAULT 0,
    direction       SMALLINT DEFAULT 5,
    admin_level     SMALLINT DEFAULT 0,
    pk_count        INT DEFAULT 0,
    ek_count        INT DEFAULT 0,
    reward_gold     INT DEFAULT 0,
    hunger          INT DEFAULT 100,
    gold            BIGINT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    last_played     TIMESTAMPTZ
);

CREATE INDEX idx_characters_account ON characters(account_id);
