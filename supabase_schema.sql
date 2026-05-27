-- === TABEL SETTINGS ===
CREATE TABLE IF NOT EXISTS public.settings (
    id text PRIMARY KEY,
    site_name text,
    tagline text,
    session_duration numeric,
    whatsapp text
);

-- Masukkan data default settings
INSERT INTO public.settings (id, site_name, tagline, session_duration, whatsapp)
VALUES ('default', 'BUMDes Mitra Sejahtera', 'Bersama Membangun Desa yang Sejahtera', 28800000, '628886360133')
ON CONFLICT (id) DO NOTHING;

-- === TABEL ADMIN USERS ===
CREATE TABLE IF NOT EXISTS public.admin_users (
    username text PRIMARY KEY,
    password text,
    name text
);

-- Masukkan data admin default (password: bumdes2026 yang sudah di-hash SHA-256)
INSERT INTO public.admin_users (username, password, name)
VALUES ('admin', '5d0c83df3af35b1d17fef97f78c1e39f52b3c37ccff4e97dbede34af1a04b16c', 'Admin BUMDes')
ON CONFLICT (username) DO NOTHING;

-- === TABEL CATEGORIES ===
CREATE TABLE IF NOT EXISTS public.categories (
    name text PRIMARY KEY
);

-- Masukkan data kategori default
INSERT INTO public.categories (name) VALUES 
('Produk BUMDes'), ('Kegiatan'), ('Pengumuman'), ('Pelatihan'), ('Umum')
ON CONFLICT (name) DO NOTHING;

-- === TABEL NEWS ===
CREATE TABLE IF NOT EXISTS public.news (
    id text PRIMARY KEY,
    title text,
    slug text UNIQUE,
    excerpt text,
    content text,
    image text,
    category text REFERENCES public.categories(name) ON UPDATE CASCADE,
    author text,
    date text,
    status text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- === TABEL PRODUCTS ===
CREATE TABLE IF NOT EXISTS public.products (
    id text PRIMARY KEY,
    name text,
    price numeric,
    description text,
    image text,
    unit text,
    status text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Matikan RLS (Row Level Security) agar bisa diakses public tanpa auth ribet (sesuai kebutuhan saat ini)
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.news DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- === TABEL ORGANIZATION ===
CREATE TABLE IF NOT EXISTS public.organization (
    id text PRIMARY KEY,
    name text,
    role_label text,
    order_index integer
);

-- Masukkan data pengurus default
INSERT INTO public.organization (id, name, role_label, order_index) VALUES
('direktur', 'Syaiful Rijal', 'Kepala Direktur', 1),
('sekretaris', '-', 'Sekretaris', 2),
('bendahara', '-', 'Bendahara', 3)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.organization DISABLE ROW LEVEL SECURITY;
