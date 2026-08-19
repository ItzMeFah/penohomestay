-- =========================================================
-- SQL SCHEMA UNTUK SUPABASE - PENO HOMESTAY BANYUWANGI
-- Salin (Copy) dan Tempel (Paste) seluruh query ini ke:
-- Supabase Dashboard -> SQL Editor -> Klik "New query" -> "Run"
-- =========================================================

-- 1. TABEL PENO_BOOKINGS (Manajemen Pemesanan Tamu)
CREATE TABLE IF NOT EXISTS public.peno_bookings (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending',
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    nights INTEGER DEFAULT 1,
    total_eur NUMERIC DEFAULT 0,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_wa TEXT,
    guest_count INTEGER DEFAULT 1,
    notes TEXT,
    "ROOM" TEXT
);

-- 2. TABEL PENO_BLOCKED (Kalender Tutup Tanggal / Not Available)
CREATE TABLE IF NOT EXISTS public.peno_blocked (
    id BIGSERIAL PRIMARY KEY,
    date_str TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PENO_CMS (Konten Beranda, Galeri, Pengaturan, Notifikasi)
CREATE TABLE IF NOT EXISTS public.peno_cms (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- KEAMANAN / ROW LEVEL SECURITY (RLS)
-- Mengizinkan aplikasi membaca & menyimpan data secara aman
-- =========================================================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.peno_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peno_blocked ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peno_cms ENABLE ROW LEVEL SECURITY;

-- Kebijakan (Policy) untuk peno_bookings
DROP POLICY IF EXISTS "Public full access to peno_bookings" ON public.peno_bookings;
CREATE POLICY "Public full access to peno_bookings"
ON public.peno_bookings
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Kebijakan (Policy) untuk peno_blocked
DROP POLICY IF EXISTS "Public full access to peno_blocked" ON public.peno_blocked;
CREATE POLICY "Public full access to peno_blocked"
ON public.peno_blocked
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Kebijakan (Policy) untuk peno_cms
DROP POLICY IF EXISTS "Public full access to peno_cms" ON public.peno_cms;
CREATE POLICY "Public full access to peno_cms"
ON public.peno_cms
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- =========================================================
-- AKTIFKAN REALTIME REPLICATION (Supabase Realtime)
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'peno_bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.peno_bookings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'peno_blocked'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.peno_blocked;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'peno_cms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.peno_cms;
  END IF;
END $$;
