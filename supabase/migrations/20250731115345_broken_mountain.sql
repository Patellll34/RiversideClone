/*
  # Initial Schema for Riverside Clone

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `rooms`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `host_id` (uuid, references profiles)
      - `room_code` (text, unique)
      - `is_active` (boolean)
      - `max_participants` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `recordings`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references rooms)
      - `title` (text)
      - `duration` (integer, seconds)
      - `file_url` (text, nullable)
      - `thumbnail_url` (text, nullable)
      - `status` (enum: recording, processing, completed, failed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `participants`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references rooms)
      - `user_id` (uuid, references profiles)
      - `joined_at` (timestamp)
      - `left_at` (timestamp, nullable)
      - `is_host` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for room participants to access room data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  host_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  room_code text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  max_participants integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recordings table
CREATE TABLE IF NOT EXISTS recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  title text NOT NULL,
  duration integer DEFAULT 0,
  file_url text,
  thumbnail_url text,
  status text DEFAULT 'recording' CHECK (status IN ('recording', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  is_host boolean DEFAULT false,
  UNIQUE(room_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Users can read rooms they host or participate in"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (
    host_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM participants
      WHERE participants.room_id = rooms.id
      AND participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rooms"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "Room hosts can update their rooms"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (host_id = auth.uid());

-- Recordings policies
CREATE POLICY "Users can read recordings from their rooms"
  ON recordings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = recordings.room_id
      AND (
        rooms.host_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM participants
          WHERE participants.room_id = rooms.id
          AND participants.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Room hosts can manage recordings"
  ON recordings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = recordings.room_id
      AND rooms.host_id = auth.uid()
    )
  );

-- Participants policies
CREATE POLICY "Users can read participants in their rooms"
  ON participants
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = participants.room_id
      AND rooms.host_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own participation"
  ON participants
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recordings_updated_at
  BEFORE UPDATE ON recordings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();