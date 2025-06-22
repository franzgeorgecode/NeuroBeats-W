/*
  # Add onboarding fields to user preferences

  1. Changes
    - Add onboarding_completed boolean field to user_preferences table
    - Update selected_songs column from uuid[] to jsonb to store full song objects
    - Handle existing data migration safely

  2. Security
    - Maintains existing RLS policies
    - No changes to security model
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

  -- Handle selected_songs column type change from uuid[] to jsonb
  -- First, check if the column is currently uuid[]
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' 
    AND column_name = 'selected_songs' 
    AND data_type = 'ARRAY'
  ) THEN
    -- Create a temporary column for the new jsonb data
    ALTER TABLE user_preferences ADD COLUMN selected_songs_temp jsonb DEFAULT '[]'::jsonb;
    
    -- Migrate existing uuid[] data to jsonb format
    -- Convert each uuid to a simple object with just the id
    UPDATE user_preferences 
    SET selected_songs_temp = (
      SELECT jsonb_agg(jsonb_build_object('id', uuid_val))
      FROM unnest(selected_songs) AS uuid_val
    )
    WHERE selected_songs IS NOT NULL AND array_length(selected_songs, 1) > 0;
    
    -- Drop the old column
    ALTER TABLE user_preferences DROP COLUMN selected_songs;
    
    -- Rename the temp column to the original name
    ALTER TABLE user_preferences RENAME COLUMN selected_songs_temp TO selected_songs;
  ELSE
    -- If column doesn't exist or is already jsonb, ensure it's jsonb with correct default
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'user_preferences' AND column_name = 'selected_songs'
    ) THEN
      ALTER TABLE user_preferences ADD COLUMN selected_songs jsonb DEFAULT '[]'::jsonb;
    ELSE
      -- Column exists, ensure it has the correct default
      ALTER TABLE user_preferences ALTER COLUMN selected_songs SET DEFAULT '[]'::jsonb;
    END IF;
  END IF;
END $$;