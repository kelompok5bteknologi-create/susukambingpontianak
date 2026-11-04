-- ========================================================================
-- SKRIP DATABASE SUPABASE UNTUK SUSU KAMBING PONTIANAK
-- Buka Supabase Dashboard > SQL Editor > New query > Paste skrip ini > Klik RUN
-- ========================================================================

-- 1. TABEL PETERNAKAN (farms)
CREATE TABLE IF NOT EXISTS public.farms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  breed TEXT NOT NULL,
  address TEXT NOT NULL,
  milked_time_ago TEXT,
  description TEXT,
  capacity TEXT,
  badge_bg TEXT DEFAULT 'bg-emerald-100',
  badge_color TEXT DEFAULT 'text-forest',
  rating NUMERIC DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL PRODUK SUSU (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'Botol',
  image TEXT,
  description TEXT,
  farm_id TEXT REFERENCES public.farms(id) ON DELETE CASCADE,
  farm_name TEXT,
  category TEXT DEFAULT 'Susu Murni',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PRODUK UNGGULAN LAINNYA (farm_other_products)
-- KOHE, Kunjungan Peternakan, Kambing Jantan
CREATE TABLE IF NOT EXISTS public.farm_other_products (
  id TEXT PRIMARY KEY,
  farm_id TEXT REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL PESANAN (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  is_guest BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'Baru',
  date TEXT NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  slot TEXT NOT NULL,
  coordinates TEXT NOT NULL,
  farm_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL NOTIFIKASI WHATSAPP (notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  time TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL RIWAYAT TRANSAKSI PEMBELI (buyer_history)
CREATE TABLE IF NOT EXISTS public.buyer_history (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Selesai',
  date TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Pembelian',
  items TEXT NOT NULL,
  farm_name TEXT NOT NULL,
  total NUMERIC NOT NULL,
  points INTEGER DEFAULT 0,
  reorder_product TEXT,
  reorder_qty INTEGER DEFAULT 1,
  price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL SLOT PRE-ORDER (preorder_slots)
CREATE TABLE IF NOT EXISTS public.preorder_slots (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  day TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Tersedia',
  booked INTEGER DEFAULT 0,
  "max" INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- ATUR KEAMANAN ROW LEVEL SECURITY (RLS) AGAR DAPAT DIAKSES DARI WEBSITE
-- ========================================================================
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_other_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preorder_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access farms" ON public.farms;
CREATE POLICY "Public Access farms" ON public.farms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access products" ON public.products;
CREATE POLICY "Public Access products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access farm_other_products" ON public.farm_other_products;
CREATE POLICY "Public Access farm_other_products" ON public.farm_other_products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access orders" ON public.orders;
CREATE POLICY "Public Access orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access notifications" ON public.notifications;
CREATE POLICY "Public Access notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access buyer_history" ON public.buyer_history;
CREATE POLICY "Public Access buyer_history" ON public.buyer_history FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access preorder_slots" ON public.preorder_slots;
CREATE POLICY "Public Access preorder_slots" ON public.preorder_slots FOR ALL USING (true) WITH CHECK (true);

-- ========================================================================
-- DATA AWAL (SEED DATA)
-- ========================================================================

-- Isi Data Peternakan
INSERT INTO public.farms (id, name, code, breed, address, milked_time_ago, description, capacity, badge_bg, badge_color, rating, review_count, phone)
VALUES
  ('enggano', 'Enggano Farm 100', 'EF', 'Saanen & Sapera', 'Jl. Enggano No. 100, Pontianak Kota', 'Diperah 3 jam lalu', 'Kandang bersih panggung modern dengan standar higienis resmi. Kambing diberi pakan rumput gajah segar dan legum berprotein tinggi, menghasilkan susu tanpa aroma prengus yang menyengat.', '40L / hari', 'bg-emerald-100', 'text-forest', 4.8, 142, '0812-5890-7821'),
  ('tazayyad', 'Tazayyad Farm', 'TF', 'Etawa Super', 'Siantan Hilir, Pontianak Utara', 'Diperah 5 jam lalu', 'Spesialis kambing perah ras Etawa unggulan dengan pemeliharaan higienis berstandar dinas. Menggunakan penyaringan steril bertingkat untuk menjamin kemurnian dan kepekatan nutrisi.', '30L / hari', 'bg-amber-100', 'text-amber-800', 4.7, 72, '0813-4455-9012')
ON CONFLICT (id) DO NOTHING;

-- Isi Data Produk Susu
INSERT INTO public.products (id, name, price, stock, unit, image, description, farm_id, farm_name, category)
VALUES
  ('prod-coklat-250', 'Susu Coklat 250ml', 18000, 25, 'Botol', 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop', 'Susu kambing pasteurisasi lezat dengan coklat bubuk Belgia alami dan pemanis tebu organik. Kaya kalsium dan cocok untuk anak-anak.', 'enggano', 'Enggano Farm 100', 'Varian Rasa'),
  ('prod-segar-1l', 'Susu Kambing Segar 1 Liter', 65000, 18, 'Botol', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop', 'Susu kambing murni ukuran hemat 1 liter dari perahan fajar. Dihasilkan dari kambing dengan pakan rumput alami Grass-fed serta diproses dengan Pasteurisasi higienis suhu rendah.', 'enggano', 'Enggano Farm 100', 'Susu Murni'),
  ('prod-segar-500', 'Susu Kambing Segar 500ml', 35000, 45, 'Botol', 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=800&auto=format&fit=crop', 'Susu segar murni perahan pagi hari tanpa pengawet. Dihasilkan dengan pakan rumput alami Grass-fed dan melalui sterilisasi suhu rendah Pasteurisasi untuk membunuh bakteri tanpa merusak nutrisi.', 'enggano', 'Enggano Farm 100', 'Susu Murni'),
  ('prod-sabun', 'Sabun Susu Kambing Batang', 22000, 8, 'Batang', 'https://images.unsplash.com/photo-1607006310492-3023223126f5?q=80&w=800&auto=format&fit=crop', 'Dibuat dari lemak susu kambing segar dan minyak kelapa murni Pontianak. Efektif melembapkan kulit kering, meredakan ruam gatal, dan bebas paraben maupun SLS.', 'enggano', 'Enggano Farm 100', 'Perawatan Kulit')
ON CONFLICT (id) DO NOTHING;

-- Isi Data Produk Unggulan Lainnya
INSERT INTO public.farm_other_products (id, farm_id, name, category, price, unit, description, image)
VALUES
  ('other-kohe-1', 'enggano', 'Pupuk Organik KOHE Fermentasi', 'KOHE', 25000, 'Karung (15 kg)', 'Pupuk kandang kotoran kambing fermentasi matang tanpa bau menyengat, bebas bibit gulma, sangat subur untuk tanaman buah, sayur, dan hias.', 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=800&auto=format&fit=crop'),
  ('other-visit-1', 'enggano', 'Paket Kunjungan & Wisata Edukasi Kandang', 'Kunjungan Peternakan', 50000, 'Orang', 'Wisata peternakan edukatif: pengalaman memerah susu kambing langsung di kandang panggung, memberi makan rumput segar, plus 1 botol susu gratis.', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=800&auto=format&fit=crop'),
  ('other-goat-1', 'enggano', 'Kambing Jantan Pejantan Unggul / Aqiqah', 'Kambing Jantan', 2800000, 'Ekor', 'Kambing jantan ras Saanen/Etawa sehat berumur di atas 1 tahun, tanduk sempurna, cukup umur untuk hewan aqiqah, qurban, atau bibit pemacek unggul.', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=800&auto=format&fit=crop'),
  ('other-kohe-2', 'tazayyad', 'KOHE Halus Khusus Sawit & Holtikultura', 'KOHE', 28000, 'Karung (15 kg)', 'Kotoran kambing Etawa giling halus hasil fermentasi EM4. Mengandung unsur hara N, P, K organik tinggi.', 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=800&auto=format&fit=crop'),
  ('other-visit-2', 'tazayyad', 'Edukasi Peternakan Modern Tazayyad', 'Kunjungan Peternakan', 45000, 'Orang', 'Kunjungan belajar budidaya kambing Etawa perah di Pontianak Utara. Cocok untuk rombongan sekolah dan mahasiswa.', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=800&auto=format&fit=crop'),
  ('other-goat-2', 'tazayyad', 'Kambing Etawa Super Jantan', 'Kambing Jantan', 3200000, 'Ekor', 'Kambing Etawa jantan postur tinggi besar (bobot 45-55 kg) siap qurban atau indukan pejantan tangguh.', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Isi Data Pesanan Contoh
INSERT INTO public.orders (id, order_number, is_guest, status, date, total, payment_method, product_name, quantity, customer_name, customer_phone, customer_address, slot, coordinates, farm_name)
VALUES
  ('ord-101', '#SKP-1234', true, 'Baru', '30 Sep 2026, 07:15 WIB', 70000, 'COD', '2x Susu Kambing Segar 500ml', 2, 'Budi Santoso', '0812-5890-7821', 'Jl. Danau Sentarum No. 45, Pontianak Kota', '12:00 - 15:00', '-0.0263, 109.3425', 'Enggano Farm 100'),
  ('ord-102', '#SKP-1288', false, 'Diproses', '30 Sep 2026, 08:30 WIB', 65000, 'QRIS', '1x Susu Kambing Segar 1 Liter', 1, 'Siti Aminah', '0852-9871-3321', 'Jl. Gajah Mada No. 12, Pontianak Selatan', '15:00 - 18:00', '-0.0381, 109.3374', 'Enggano Farm 100'),
  ('ord-103', '#SKP-1190', true, 'Baru', '30 Sep 2026, 09:10 WIB', 36000, 'Transfer Bank', '2x Susu Coklat 250ml', 2, 'Rian Hidayat', '0813-8902-1244', 'Jl. Ahmad Yani Komp. Perdana, Pontianak', '06:00 - 09:00', '-0.0520, 109.3512', 'Tazayyad Farm')
ON CONFLICT (id) DO NOTHING;

-- Isi Data Notifikasi Contoh
INSERT INTO public.notifications (id, title, description, type, time, read)
VALUES
  ('notif-1', 'Stok baru dari Enggano Farm 100', 'Pemerahan fajar 30 botol siap diorder sekarang.', 'stock', 'Baru saja', false),
  ('notif-2', 'Pesanan #SKP-1234 sedang diproses', 'Kambing sedang diperah higienis oleh peternak.', 'order', '15 menit lalu', false),
  ('notif-3', 'Pre-order Anda siap diambil', 'Silakan ambil di kandang sebelum pukul 11:00 WIB.', 'preorder', '1 jam lalu', false)
ON CONFLICT (id) DO NOTHING;

-- Isi Data Riwayat Pembeli Contoh
INSERT INTO public.buyer_history (id, order_number, status, date, category, items, farm_name, total, points, reorder_product, reorder_qty, price)
VALUES
  ('h-1', '#SKP-99214', 'Selesai', '28 Sep 2026', 'Pembelian', '2x Susu Kambing Segar 500ml', 'Enggano Farm 100', 70000, 70, 'Susu Kambing Segar 500ml', 2, 35000),
  ('h-2', '#SKP-88102', 'Selesai', '22 Sep 2026', 'Pembelian', '1x Sabun Susu Kambing Batang', 'Enggano Farm 100', 22000, 22, 'Sabun Susu Kambing Batang', 1, 22000),
  ('h-3', '#SKP-77401', 'Selesai', '15 Sep 2026', 'Pembelian', '1x Susu Kambing Segar 1 Liter', 'Enggano Farm 100', 65000, 65, 'Susu Kambing Segar 1 Liter', 1, 65000)
ON CONFLICT (id) DO NOTHING;

-- Isi Data Slot Preorder
INSERT INTO public.preorder_slots (id, date, day, status, booked, "max")
VALUES
  (1, '01 Okt', 'Kamis', 'Tersedia', 12, 20),
  (2, '02 Okt', 'Jumat', 'Penuh', 20, 20),
  (3, '03 Okt', 'Sabtu', 'Tersedia', 8, 20),
  (4, '04 Okt', 'Minggu', 'Tersedia', 15, 20)
ON CONFLICT (id) DO NOTHING;
