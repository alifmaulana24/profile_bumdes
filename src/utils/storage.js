// ===== LOCAL STORAGE KEYS =====
export const KEYS = {
  NEWS: 'bumdes_news',
  CREDENTIALS: 'bumdes_admin_credentials',
  SESSION: 'bumdes_admin_session',
  SETTINGS: 'bumdes_settings',
  CATEGORIES: 'bumdes_news_categories',
  PRODUCTS: 'bumdes_products',
};

// ===== DEFAULT DATA =====
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: '5d0c83df3af35b1d17fef97f78c1e39f52b3c37ccff4e97dbede34af1a04b16c', // bumdes2026 SHA-256
  name: 'Admin BUMDes',
};

const DEFAULT_CATEGORIES = [
  'Produk BUMDes', 'Kegiatan', 'Pengumuman', 'Pelatihan', 'Umum'
];

const DEFAULT_SETTINGS = {
  siteName: 'BUMDes Mitra Sejahtera',
  tagline: 'Bersama Membangun Desa yang Sejahtera',
  sessionDuration: 8 * 60 * 60 * 1000, // 8 jam dalam ms
  whatsapp: '628886360133', // Format: 628xxx (tanpa + atau 0 di depan)
};

// ===== SEED DATA =====
const SEED_NEWS = [
  {
    id: '1716364800000_seed2',
    title: 'Program Simpan Pinjam Petani: 200 Anggota Terbantu Modal Usaha',
    slug: 'program-simpan-pinjam-petani-200-anggota-terbantu-modal-usaha',
    excerpt: 'Memasuki tahun ke-3, program simpan pinjam khusus petani BUMDes Mitra Sejahtera telah berhasil membantu 200 anggota aktif dengan total penyaluran pinjaman mencapai Rp 1,2 miliar.',
    content: `## Program Simpan Pinjam Petani: Mendukung Kemandirian Finansial

Program Simpan Pinjam Petani BUMDes Mitra Sejahtera terus menunjukkan perkembangan yang menggembirakan. Memasuki tahun ke-3 operasional, program ini telah menyentuh kehidupan **200 anggota aktif** dengan total penyaluran dana mencapai **Rp 1,2 miliar**.

### Keunggulan Program

1. **Bunga rendah** - Hanya 0,5% per bulan, jauh di bawah bank konvensional
2. **Proses cepat** - Pencairan dalam 3 hari kerja
3. **Tanpa agunan** - Cukup rekomendasi sesama anggota (sistem tanggung renteng)
4. **Fleksibel** - Tenor 3-24 bulan sesuai kebutuhan

### Dampak yang Dirasakan

Banyak petani yang mengaku terbantu untuk membeli bibit, pupuk, dan peralatan pertanian tepat waktu tanpa harus menunggu hasil panen.

> "Dulu saya harus meminjam dari tengkulak dengan bunga yang sangat tinggi. Sekarang dengan program ini, saya bisa lebih tenang dalam bertani." — Pak Suharto, petani mitra

### Tingkat Pengembalian

Tingkat Non-Performing Loan (NPL) program ini tercatat hanya **1,2%**, jauh di bawah rata-rata industri keuangan mikro sebesar 5%.`,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    category: 'Keuangan',
    author: 'Admin BUMDes',
    date: '2026-05-05',
    status: 'published',
    createdAt: '2026-05-05T08:00:00Z',
    updatedAt: '2026-05-05T08:00:00Z',
  },
];

const SEED_PRODUCTS = [

];

// ===== INITIALIZE =====
export const initializeStorage = () => {
  // PAKSA OVERWRITE CREDENTIALS AGAR BISA LOGIN DENGAN PASSWORD BARU
  localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify(DEFAULT_CREDENTIALS));
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.NEWS)) {
    localStorage.setItem(KEYS.NEWS, JSON.stringify(SEED_NEWS));
  }
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
  }
};

// ===== NEWS CRUD =====
export const getNews = () => {
  try {
    const data = localStorage.getItem(KEYS.NEWS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveNews = (newsArray) => {
  localStorage.setItem(KEYS.NEWS, JSON.stringify(newsArray));
};

export const getPublishedNews = () => {
  return getNews()
    .filter(n => n.status === 'published')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getNewsBySlug = (slug) => {
  return getNews().find(n => n.slug === slug && n.status === 'published') || null;
};

export const getNewsById = (id) => {
  return getNews().find(n => n.id === id) || null;
};

export const addNews = (newsItem) => {
  const all = getNews();
  const newItem = {
    ...newsItem,
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveNews([...all, newItem]);
  return newItem;
};

export const updateNews = (id, updates) => {
  const all = getNews();
  const updated = all.map(n =>
    n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
  );
  saveNews(updated);
};

export const deleteNews = (id) => {
  const all = getNews();
  saveNews(all.filter(n => n.id !== id));
};

export const toggleNewsStatus = (id) => {
  const all = getNews();
  const updated = all.map(n =>
    n.id === id
      ? { ...n, status: n.status === 'published' ? 'draft' : 'published', updatedAt: new Date().toISOString() }
      : n
  );
  saveNews(updated);
};

// ===== AUTH =====
export const getCredentials = () => {
  try {
    const data = localStorage.getItem(KEYS.CREDENTIALS);
    if (data) {
      const parsed = JSON.parse(data);
      // Jika password lama berbentuk hash panjang (64 karakter), paksa hapus dan gunakan default baru
      if (parsed.password && parsed.password.length === 64) {
        localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify(DEFAULT_CREDENTIALS));
        return DEFAULT_CREDENTIALS;
      }
      return parsed;
    }
    return DEFAULT_CREDENTIALS;
  } catch {
    return DEFAULT_CREDENTIALS;
  }
};

export const saveCredentials = (creds) => {
  localStorage.setItem(KEYS.CREDENTIALS, JSON.stringify(creds));
};

export const getSession = () => {
  try {
    const data = localStorage.getItem(KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveSession = (session) => {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(KEYS.SESSION);
};

export const isSessionValid = () => {
  const session = getSession();
  return session && session.expiresAt > Date.now();
};

// ===== SETTINGS =====
export const getSettings = () => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed, whatsapp: parsed.whatsapp || DEFAULT_SETTINGS.whatsapp };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// ===== CATEGORIES =====
export const getCategories = () => {
  try {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (cats) => {
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
};

// ===== EXPORT / IMPORT =====
export const exportData = () => {
  return {
    news: getNews(),
    categories: getCategories(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  };
};

export const importData = (data) => {
  if (data.news) saveNews(data.news);
  if (data.categories) saveCategories(data.categories);
  if (data.settings) saveSettings(data.settings);
};

export const resetAllData = () => {
  localStorage.removeItem(KEYS.NEWS);
  localStorage.removeItem(KEYS.CATEGORIES);
  localStorage.removeItem(KEYS.SETTINGS);
  localStorage.removeItem(KEYS.SESSION);
  localStorage.removeItem(KEYS.PRODUCTS);
  initializeStorage();
};

// ===== PRODUCT CRUD =====
export const getProducts = () => {
  try {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveProducts = (products) => {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const addProduct = (product) => {
  const all = getProducts();
  const newProduct = {
    ...product,
    id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveProducts([newProduct, ...all]);
  return newProduct;
};

export const updateProduct = (id, updates) => {
  const all = getProducts();
  saveProducts(
    all.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    )
  );
};

export const deleteProduct = (id) => {
  const all = getProducts();
  saveProducts(all.filter(p => p.id !== id));
};

// ===== NO HASH (PLAIN TEXT) =====
export const hashPassword = async (password) => {
  return password; // Mengembalikan teks biasa sesuai permintaan
};
