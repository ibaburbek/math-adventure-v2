-- =====================================================================
-- MATH ADVENTURE - SUPABASE DATABASE MIGRATION
-- Production PostgreSQL Schema with RLS, UUIDs, Indexes, and Functions
-- =====================================================================

-- 1. Enable pgcrypto for UUIDs and PIN hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('teacher', 'student');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('multiple_choice', 'numeric', 'text', 'image_based', 'open_ended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE shop_category AS ENUM ('characters', 'hats', 'clothing', 'accessories', 'shoes');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Teachers & Students)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  avatar_id TEXT DEFAULT 'knight',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. CLASSES TABLE
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. STUDENTS TABLE (Game & progression attributes)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  character_config JSONB NOT NULL DEFAULT '{"characterId":"knight","primaryColor":"#3b82f6","secondaryColor":"#f59e0b","skinTone":"#fcd34d","hatId":"helm","outfitId":"armor","accessoryId":"shield","shoesId":"boots","animationState":"idle"}',
  current_world_id TEXT NOT NULL DEFAULT 'world_forest',
  current_level_id TEXT NOT NULL DEFAULT 'lvl_forest_1',
  coins INTEGER NOT NULL DEFAULT 50 CHECK (coins >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. CLASS_STUDENTS TABLE (Junction)
CREATE TABLE IF NOT EXISTS class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(class_id, student_id)
);

-- 7. WORLDS TABLE
CREATE TABLE IF NOT EXISTS worlds (
  id TEXT PRIMARY KEY,
  theme TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_kk TEXT NOT NULL,
  description_en TEXT,
  description_ru TEXT,
  description_kk TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  bg_gradient TEXT NOT NULL
);

-- 8. LEVELS TABLE
CREATE TABLE IF NOT EXISTS levels (
  id TEXT PRIMARY KEY,
  world_id TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_kk TEXT NOT NULL,
  total_tiles INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 9. QUESTION_SETS TABLE (Teacher Reusable Question Bank)
CREATE TABLE IF NOT EXISTS question_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty question_difficulty NOT NULL DEFAULT 'medium',
  coin_reward INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 10. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_set_id UUID REFERENCES question_sets(id) ON DELETE SET NULL,
  world_id TEXT REFERENCES worlds(id) ON DELETE CASCADE,
  level_id TEXT REFERENCES levels(id) ON DELETE CASCADE,
  tile_index INTEGER,
  type question_type NOT NULL DEFAULT 'multiple_choice',
  prompt_en TEXT NOT NULL,
  prompt_ru TEXT NOT NULL,
  prompt_kk TEXT NOT NULL,
  math_formula TEXT,
  image_url TEXT,
  options JSONB,
  correct_answer TEXT NOT NULL,
  acceptable_tolerance NUMERIC DEFAULT 0,
  explanation_en TEXT,
  explanation_ru TEXT,
  explanation_kk TEXT,
  difficulty question_difficulty NOT NULL DEFAULT 'medium',
  coin_reward INTEGER NOT NULL DEFAULT 20,
  is_manual_check BOOLEAN NOT NULL DEFAULT false,
  topic TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_set_id UUID NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 12. ASSIGNMENT_STUDENTS TABLE
CREATE TABLE IF NOT EXISTS assignment_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'assigned', -- 'assigned', 'in_progress', 'completed'
  completed_at TIMESTAMPTZ,
  UNIQUE(assignment_id, student_id)
);

-- 13. STUDENT_PROGRESS TABLE (Tile & level tracking)
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  world_id TEXT NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  level_id TEXT NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  current_tile INTEGER NOT NULL DEFAULT 0,
  completed_tiles INTEGER[] NOT NULL DEFAULT '{}',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  stars INTEGER NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  coins_awarded_question_ids TEXT[] NOT NULL DEFAULT '{}',
  last_updated TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(student_id, level_id)
);

-- 14. QUESTION_ATTEMPTS TABLE (3-attempt tracking)
CREATE TABLE IF NOT EXISTS question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  level_id TEXT NOT NULL,
  tile_index INTEGER NOT NULL,
  attempt_number INTEGER NOT NULL CHECK (attempt_number >= 1 AND attempt_number <= 3),
  submitted_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 15. MANUAL_SUBMISSIONS TABLE (Open-ended review queue)
CREATE TABLE IF NOT EXISTS manual_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  solution_text TEXT NOT NULL,
  image_url TEXT,
  status submission_status NOT NULL DEFAULT 'pending',
  teacher_feedback TEXT,
  coin_reward INTEGER NOT NULL DEFAULT 20,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  reviewed_at TIMESTAMPTZ
);

-- 16. COIN_TRANSACTIONS TABLE (Audit log preventing duplicate rewards)
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id TEXT, -- e.g. question_id or shop_item_id
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 17. SHOP_ITEMS TABLE
CREATE TABLE IF NOT EXISTS shop_items (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_kk TEXT NOT NULL,
  category shop_category NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  asset_key TEXT NOT NULL,
  color_hex TEXT,
  badge TEXT,
  description_en TEXT,
  description_ru TEXT,
  description_kk TEXT
);

-- 18. STUDENT_INVENTORY TABLE
CREATE TABLE IF NOT EXISTS student_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
  is_equipped BOOLEAN NOT NULL DEFAULT false,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(student_id, item_id)
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_inventory ENABLE ROW LEVEL SECURITY;

-- Allow public read of worlds, levels, shop items
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read worlds" ON worlds FOR SELECT USING (true);
CREATE POLICY "Public read levels" ON levels FOR SELECT USING (true);
CREATE POLICY "Public read shop items" ON shop_items FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_teacher ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_questions_level ON questions(level_id, tile_index);
CREATE INDEX IF NOT EXISTS idx_submissions_teacher ON manual_submissions(teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_coin_tx_ref ON coin_transactions(student_id, reference_id);

-- =====================================================================
-- RPC FUNCTIONS: ATOMIC COIN AWARD & PROGRESSION
-- =====================================================================

CREATE OR REPLACE FUNCTION award_step_and_coins(
  p_student_id UUID,
  p_question_id UUID,
  p_level_id TEXT,
  p_tile_index INTEGER,
  p_coins INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_already_awarded BOOLEAN;
  v_new_coins INTEGER;
BEGIN
  -- 1. Check if coins were already awarded for this question
  SELECT EXISTS (
    SELECT 1 FROM coin_transactions
    WHERE student_id = p_student_id AND reference_id = p_question_id::TEXT
  ) INTO v_already_awarded;

  -- 2. Award coins if not previously awarded
  IF NOT v_already_awarded AND p_coins > 0 THEN
    INSERT INTO coin_transactions (student_id, amount, reason, reference_id)
    VALUES (p_student_id, p_coins, 'question_solved', p_question_id::TEXT);

    UPDATE students
    SET coins = coins + p_coins
    WHERE id = p_student_id
    RETURNING coins INTO v_new_coins;
  ELSE
    SELECT coins INTO v_new_coins FROM students WHERE id = p_student_id;
  END IF;

  -- 3. Upsert student progress: advance tile if p_tile_index >= current_tile
  INSERT INTO student_progress (student_id, world_id, level_id, current_tile, completed_tiles, last_updated)
  VALUES (
    p_student_id,
    (SELECT world_id FROM levels WHERE id = p_level_id),
    p_level_id,
    p_tile_index + 1,
    ARRAY[p_tile_index],
    now()
  )
  ON CONFLICT (student_id, level_id)
  DO UPDATE SET
    current_tile = GREATEST(student_progress.current_tile, p_tile_index + 1),
    completed_tiles = array_append(student_progress.completed_tiles, p_tile_index),
    last_updated = now();

  RETURN jsonb_build_object(
    'success', true,
    'coinsAwarded', NOT v_already_awarded,
    'totalCoins', v_new_coins,
    'nextTile', p_tile_index + 1
  );
END;
$$;
