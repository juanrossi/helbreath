-- Add intro_shown flag to track whether a character has seen the welcome modal
ALTER TABLE characters ADD COLUMN IF NOT EXISTS intro_shown BOOLEAN DEFAULT FALSE;
