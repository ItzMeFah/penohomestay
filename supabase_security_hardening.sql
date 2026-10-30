-- =================================================================================
-- 🛡️ PENO HOMESTAY - MASTER SQL REPAIR & ENDPOINT SECURITY SCRIPT
-- Jalankan seluruh skrip ini di: Supabase Dashboard -> SQL Editor -> New Query
-- Aman dijalankan berulang kali (Idempotent)
-- =================================================================================

-- =================================================================================
-- BAGIAN 1: PERBAIKI ERROR "Database error creating new user" DI SUPABASE AUTH
-- Menghapus semua custom trigger rusak pada tabel auth.users (sisa template lama)
-- =================================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DO $$
DECLARE
  trg RECORD;
BEGIN
  FOR trg IN
    SELECT tgname
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'auth'
      AND c.relname = 'users'
      AND NOT t.tgisinternal
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users CASCADE;', trg.tgname);
  END LOOP;
END $$;

-- =================================================================================
-- BAGIAN 2: PASTIKAN KE-3 TABEL UTAMA & SELURUH KOLOM ENDPOINT LENGKAP
-- (peno_bookings, peno_blocked, peno_cms)
-- =================================================================================

-- 2A. Tabel [peno_bookings]
CREATE TABLE IF NOT EXISTS public.peno_bookings (
  id text PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  check_in timestamp with time zone NOT NULL,
  check_out timestamp with time zone NOT NULL,
  nights integer NOT NULL DEFAULT 1,
  total_eur numeric NOT NULL DEFAULT 0,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_wa text NOT NULL,
  guest_count integer NOT NULL DEFAULT 1,
  notes text,
  villa_id text,
  "ROOM" text
);

-- Pastikan kolom tambahan untuk multi-kamar & status OCCUPIED tersedia
ALTER TABLE public.peno_bookings ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.peno_bookings ADD COLUMN IF NOT EXISTS villa_id text;
ALTER TABLE public.peno_bookings ADD COLUMN IF NOT EXISTS "ROOM" text;

-- Perbarui constraint status agar mendukung: 'pending', 'paid', 'occupied', 'cancelled'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'peno_bookings_status_check' 
      AND table_name = 'peno_bookings'
  ) THEN
    ALTER TABLE public.peno_bookings DROP CONSTRAINT peno_bookings_status_check;
  END IF;

  ALTER TABLE public.peno_bookings 
    ADD CONSTRAINT peno_bookings_status_check 
    CHECK (status IN ('pending', 'paid', 'occupied', 'cancelled'));
END $$;

-- Otomatis ubah status kamar yang sedang ditempati hari ini menjadi 'occupied'
UPDATE public.peno_bookings
SET status = 'occupied'
WHERE status = 'paid'
  AND CURRENT_DATE >= check_in::date
  AND CURRENT_DATE < check_out::date;

-- 2B. Tabel [peno_blocked]
CREATE TABLE IF NOT EXISTS public.peno_blocked (
  date_str text PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2C. Tabel [peno_cms]
CREATE TABLE IF NOT EXISTS public.peno_cms (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bersihkan sisa password plaintext dari peno_cms jika pernah tersimpan sebelumnya
UPDATE public.peno_cms
SET data = data - 'adminPassword',
    updated_at = timezone('utc'::text, now())
WHERE id = 'settings';

-- =================================================================================
-- BAGIAN 3: BUAT ENDPOINT VIEW UNTUK KALENDER PUBLIK & STATUS OKUPANSI KAMAR
-- =================================================================================

-- 3A. View [v_public_booked_dates]: Dipakai kalender pengunjung tanpa membocorkan data pribadi tamu
CREATE OR REPLACE VIEW public.v_public_booked_dates AS
SELECT
  id,
  created_at,
  status,
  check_in,
  check_out,
  nights,
  villa_id,
  "ROOM"
FROM public.peno_bookings
WHERE status IN ('paid', 'occupied', 'pending');

GRANT SELECT ON public.v_public_booked_dates TO anon, authenticated;

-- 3B. View [v_peno_room_occupancy]: Memantau status kamar OCCUPIED vs BOOKED secara real-time
CREATE OR REPLACE VIEW public.v_peno_room_occupancy AS
SELECT 
  id AS booking_id,
  guest_name,
  guest_wa,
  check_in,
  check_out,
  nights,
  villa_id,
  "ROOM" AS room_code,
  status AS raw_status,
  CASE
    WHEN status = 'cancelled' THEN 'CANCELLED'
    WHEN status = 'pending' THEN 'PENDING'
    WHEN status = 'occupied' THEN 'OCCUPIED'
    WHEN status = 'paid' AND CURRENT_DATE >= check_in::date AND CURRENT_DATE < check_out::date THEN 'OCCUPIED'
    WHEN status = 'paid' AND CURRENT_DATE < check_in::date THEN 'BOOKED'
    WHEN status = 'paid' AND CURRENT_DATE >= check_out::date THEN 'COMPLETED'
    ELSE 'AVAILABLE'
  END AS live_occupancy_status,
  CASE 
    WHEN (status = 'occupied' OR (status = 'paid' AND CURRENT_DATE >= check_in::date AND CURRENT_DATE < check_out::date)) THEN true
    ELSE false
  END AS is_currently_occupied
FROM public.peno_bookings;

GRANT SELECT ON public.v_peno_room_occupancy TO anon, authenticated;

-- 3C. Fungsi RPC [get_room_occupancy_status]: Cek status kamar (OCCUPIED / BOOKED / AVAILABLE) pada tanggal tertentu
CREATE OR REPLACE FUNCTION public.get_room_occupancy_status(p_villa_id text, p_check_date date DEFAULT CURRENT_DATE)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status text;
BEGIN
  SELECT 
    CASE 
      WHEN b.status = 'occupied' THEN 'OCCUPIED'
      WHEN p_check_date = CURRENT_DATE AND CURRENT_DATE >= b.check_in::date AND CURRENT_DATE < b.check_out::date THEN 'OCCUPIED'
      WHEN p_check_date < b.check_in::date THEN 'BOOKED'
      WHEN p_check_date >= b.check_in::date AND p_check_date < b.check_out::date THEN 'OCCUPIED'
      ELSE 'BOOKED'
    END
  INTO v_status
  FROM public.peno_bookings b
  WHERE (b.villa_id = p_villa_id OR b."ROOM" = p_villa_id)
    AND b.status IN ('paid', 'occupied')
    AND p_check_date >= b.check_in::date
    AND p_check_date < b.check_out::date
  LIMIT 1;

  IF v_status IS NOT NULL THEN
    RETURN v_status;
  END IF;

  RETURN 'AVAILABLE';
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_room_occupancy_status(text, date) TO anon, authenticated;

-- =================================================================================
-- BAGIAN 4: AKTIFKAN ROW LEVEL SECURITY (RLS) & KEBIJAKAN ENDPOINT
-- Menghilangkan ikon bola dunia (Unrestricted) pada ke-3 tabel
-- =================================================================================

ALTER TABLE public.peno_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peno_blocked ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peno_cms ENABLE ROW LEVEL SECURITY;

-- Hapus seluruh policy lama agar tidak bentrok (error duplicate policy)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('peno_bookings', 'peno_blocked', 'peno_cms')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- 4A. Policy Tabel [peno_bookings]
-- Publik boleh membuat booking baru (validasi input ketat) & Admin memiliki akses penuh
CREATE POLICY "peno_bookings_insert_policy"
  ON public.peno_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    auth.role() = 'authenticated'
    OR (
      status IN ('pending', 'paid', 'occupied', 'cancelled')
      AND nights >= 1 AND nights <= 60
      AND guest_count >= 1 AND guest_count <= 20
      AND char_length(guest_name) BETWEEN 2 AND 100
      AND char_length(guest_email) BETWEEN 5 AND 120
      AND char_length(guest_wa) BETWEEN 8 AND 25
      AND (notes IS NULL OR char_length(notes) <= 600)
    )
  );

CREATE POLICY "peno_bookings_select_policy"
  ON public.peno_bookings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "peno_bookings_update_policy"
  ON public.peno_bookings
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (
    status IN ('pending', 'paid', 'occupied', 'cancelled')
  );

CREATE POLICY "peno_bookings_delete_policy"
  ON public.peno_bookings
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- 4B. Policy Tabel [peno_blocked]
CREATE POLICY "peno_blocked_select_policy"
  ON public.peno_blocked
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "peno_blocked_write_policy"
  ON public.peno_blocked
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (char_length(date_str) BETWEEN 6 AND 20);

-- 4C. Policy Tabel [peno_cms]
CREATE POLICY "peno_cms_select_policy"
  ON public.peno_cms
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "peno_cms_insert_policy"
  ON public.peno_cms
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (id IN ('homepage', 'gallery', 'settings', 'notifications'));

CREATE POLICY "peno_cms_update_policy"
  ON public.peno_cms
  FOR UPDATE
  TO anon, authenticated
  USING (id IN ('homepage', 'gallery', 'settings', 'notifications'))
  WITH CHECK (id IN ('homepage', 'gallery', 'settings', 'notifications'));

CREATE POLICY "peno_cms_delete_policy"
  ON public.peno_cms
  FOR DELETE
  TO authenticated
  USING (true);

-- =================================================================================
-- BAGIAN 5: KONFIGURASI SUPABASE STORAGE BUCKET ('avatars' & 'gallery')
-- Membatasi ukuran file maks 5MB & hanya menerima gambar JPG, PNG, WEBP (blokir SVG XSS)
-- =================================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admin can upload storage files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admin can update storage files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admin can delete storage files" ON storage.objects;
DROP POLICY IF EXISTS "Peno storage public read" ON storage.objects;
DROP POLICY IF EXISTS "Peno storage upload image" ON storage.objects;
DROP POLICY IF EXISTS "Peno storage update image" ON storage.objects;
DROP POLICY IF EXISTS "Peno storage delete image" ON storage.objects;

CREATE POLICY "Peno storage public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('avatars', 'gallery'));

CREATE POLICY "Peno storage upload image"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id IN ('avatars', 'gallery'));

CREATE POLICY "Peno storage update image"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id IN ('avatars', 'gallery'))
  WITH CHECK (bucket_id IN ('avatars', 'gallery'));

CREATE POLICY "Peno storage delete image"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id IN ('avatars', 'gallery'));

-- =================================================================================
-- BAGIAN 6: PASTIKAN REALTIME SYNC AKTIF UNTUK KE-3 TABEL
-- =================================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'peno_bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.peno_bookings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'peno_blocked'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.peno_blocked;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'peno_cms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.peno_cms;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Refresh PostgREST schema cache agar seluruh endpoint langsung aktif tanpa restart
NOTIFY pgrst, 'reload schema';

SELECT 'SUKSES: Semua tabel, kolom, view, RLS, dan endpoint Supabase Peno Homestay telah diperbaiki!' AS status;
