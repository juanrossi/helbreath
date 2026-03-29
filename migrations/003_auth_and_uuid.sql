-- Add UUID to accounts for JWT subject
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
-- Ensure existing accounts get UUIDs
UPDATE accounts SET uuid = gen_random_uuid() WHERE uuid IS NULL;
ALTER TABLE accounts ALTER COLUMN uuid SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_uuid ON accounts(uuid);
