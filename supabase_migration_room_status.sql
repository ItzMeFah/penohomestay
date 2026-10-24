-- ============================================================================
-- 🏨 PENO HOMESTAY - ROOM OCCUPANCY & STATUS MIGRATION SCRIPT
-- ============================================================================
-- Logika:
-- 1. Status 'OCCUPIED' khusus untuk kamar yang SEDANG DITEMPATI tamu (aktif menginap hari ini).
-- 2. Status 'paid' / 'BOOKED' untuk reservasi mendatang yang sudah lunas tetapi tamu belum check-in.
-- 3. Status 'pending' untuk pemesanan yang menunggu transfer.
-- 4. Status 'cancelled' untuk pemesanan yang dibatalkan.
-- ============================================================================

-- Langkah 1: Perbarui batasan CHECK pada kolom status di tabel [peno_bookings]
DO $$
BEGIN
  -- Hapus constraint lama jika ada
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'peno_bookings_status_check' 
      AND table_name = 'peno_bookings'
  ) THEN
    ALTER TABLE peno_bookings DROP CONSTRAINT peno_bookings_status_check;
  END IF;

  -- Tambahkan constraint baru yang mencakup status 'occupied'
  ALTER TABLE peno_bookings 
    ADD CONSTRAINT peno_bookings_status_check 
    CHECK (status IN ('pending', 'paid', 'occupied', 'cancelled'));
END $$;

-- Langkah 2: Tambahkan kolom ROOM jika belum ada untuk kompatibilitas room_code
ALTER TABLE peno_bookings ADD COLUMN IF NOT EXISTS "ROOM" text;
ALTER TABLE peno_bookings ADD COLUMN IF NOT EXISTS villa_id text;

-- Langkah 3: Update otomatis data pemesanan yang saat ini sedang berlangsung ke 'occupied'
-- Jika hari ini berada di antara check_in dan check_out, ubah status menjadi 'occupied'
UPDATE peno_bookings
SET status = 'occupied'
WHERE status = 'paid'
  AND CURRENT_DATE >= check_in::date
  AND CURRENT_DATE < check_out::date;

-- Langkah 4: Buat VIEW Pintar untuk memantau status okupansi kamar secara real-time
CREATE OR REPLACE VIEW v_peno_room_occupancy AS
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
FROM peno_bookings;

-- Langkah 5: Fungsi SQL Helper untuk memeriksa ketersediaan & okupansi kamar pada tanggal tertentu
CREATE OR REPLACE FUNCTION get_room_occupancy_status(p_villa_id text, p_check_date date DEFAULT CURRENT_DATE)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status text;
BEGIN
  -- Cek apakah ada booking aktif pada tanggal yang ditentukan
  SELECT 
    CASE 
      WHEN b.status = 'occupied' THEN 'OCCUPIED'
      WHEN p_check_date = CURRENT_DATE AND CURRENT_DATE >= b.check_in::date AND CURRENT_DATE < b.check_out::date THEN 'OCCUPIED'
      WHEN p_check_date < b.check_in::date THEN 'BOOKED'
      WHEN p_check_date >= b.check_in::date AND p_check_date < b.check_out::date THEN 'OCCUPIED'
      ELSE 'BOOKED'
    END
  INTO v_status
  FROM peno_bookings b
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

-- Langkah 6: Berikan hak akses kepada anon dan authenticated
GRANT SELECT ON v_peno_room_occupancy TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_room_occupancy_status(text, date) TO anon, authenticated;

-- Verifikasi hasil
SELECT 'Migration status OCCUPIED selesai dijalankan dengan sukses!' AS status;
