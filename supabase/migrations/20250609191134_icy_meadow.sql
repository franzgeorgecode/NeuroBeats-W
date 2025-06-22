/*
  # Add onboarding fields to user preferences

  1. Changes
    - Add onboarding_completed boolean field to user_preferences table
    - Update selected_songs to store full song objects instead of just UUIDs
    - Add default values for new fields

  2. Security
    - Maintain existing RLS policies
*/

DO $$
BEGIN
  -- Add onboarding_completed field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;

  -- Update selected_songs column to allow JSONB for full song objects
  ALTER TABLE user_preferences ALTER COLUMN selected_songs TYPE jsonb USING selected_songs::jsonb;
  ALTER TABLE user_preferences ALTER COLUMN selected_songs SET DEFAULT '[]'::jsonb;
END $$;