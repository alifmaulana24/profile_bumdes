import { supabase } from './supabase';

// ===== LOCAL STORAGE KEYS FOR SESSION ONLY =====
export const KEYS = {
  SESSION: 'bumdes_admin_session',
};

// ===== DEFAULTS (FALLBACK) =====
const DEFAULT_SETTINGS = {
  siteName: 'BUMDes Mitra Sejahtera',
  tagline: 'Bersama Membangun Desa yang Sejahtera',
  sessionDuration: 8 * 60 * 60 * 1000, 
  whatsapp: '628886360133',
};

// ===== INITIALIZE (NO LONGER NEEDED FOR SUPABASE, BUT KEPT FOR COMPAT) =====
export const initializeStorage = async () => {
  // handled by sql script now
};

// ===== NEWS CRUD =====
export const getNews = async () => {
  const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
  if (error) console.error(error);
  return data || [];
};

export const getPublishedNews = async () => {
  const { data, error } = await supabase.from('news').select('*').eq('status', 'published').order('date', { ascending: false });
  if (error) console.error(error);
  return data || [];
};

export const getNewsBySlug = async (slug) => {
  const { data, error } = await supabase.from('news').select('*').eq('slug', slug).eq('status', 'published').single();
  if (error) console.error(error);
  return data || null;
};

export const getNewsById = async (id) => {
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
  if (error) console.error(error);
  return data || null;
};

export const addNews = async (newsItem) => {
  const newItem = {
    ...newsItem,
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('news').insert([newItem]).select().single();
  if (error) { console.error(error); return newItem; }
  return data;
};

export const updateNews = async (id, updates) => {
  const { error } = await supabase.from('news').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) console.error(error);
};

export const deleteNews = async (id) => {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) console.error(error);
};

export const toggleNewsStatus = async (id) => {
  const news = await getNewsById(id);
  if (news) {
    const newStatus = news.status === 'published' ? 'draft' : 'published';
    await updateNews(id, { status: newStatus });
  }
};

// ===== AUTH =====
export const getCredentials = async () => {
  const { data, error } = await supabase.from('admin_users').select('*').eq('username', 'admin').single();
  if (error) {
    console.error(error);
    return { username: 'admin', password: '5d0c83df3af35b1d17fef97f78c1e39f52b3c37ccff4e97dbede34af1a04b16c', name: 'Admin BUMDes' };
  }
  return data;
};

export const saveCredentials = async (creds) => {
  const { error } = await supabase.from('admin_users').update({
    password: creds.password,
    name: creds.name
  }).eq('username', creds.username);
  if (error) console.error(error);
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
export const getSettings = async () => {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 'default').single();
  if (error || !data) {
    console.error(error);
    return DEFAULT_SETTINGS;
  }
  return {
    siteName: data.site_name,
    tagline: data.tagline,
    sessionDuration: Number(data.session_duration),
    whatsapp: data.whatsapp
  };
};

export const saveSettings = async (settings) => {
  const { error } = await supabase.from('settings').upsert({
    id: 'default',
    site_name: settings.siteName,
    tagline: settings.tagline,
    session_duration: settings.sessionDuration,
    whatsapp: settings.whatsapp
  });
  if (error) console.error(error);
};

// ===== CATEGORIES =====
export const getCategories = async () => {
  const { data, error } = await supabase.from('categories').select('name');
  if (error) {
    console.error(error);
    return ['Produk BUMDes', 'Kegiatan', 'Pengumuman', 'Pelatihan', 'Umum'];
  }
  return data.map(c => c.name);
};

export const saveCategories = async (cats) => {
  // Hapus semua lalu insert ulang untuk simplifikasi
  await supabase.from('categories').delete().neq('name', '');
  const items = cats.map(c => ({ name: c }));
  if (items.length > 0) {
    await supabase.from('categories').insert(items);
  }
};

// ===== PRODUCT CRUD =====
export const getProducts = async () => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data;
};

export const addProduct = async (product) => {
  const newProduct = {
    ...product,
    id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
  if (error) { console.error(error); return newProduct; }
  return data;
};

export const updateProduct = async (id, updates) => {
  const { error } = await supabase.from('products').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) console.error(error);
};

export const deleteProduct = async (id) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) console.error(error);
};

// ===== OTHERS =====
export const hashPassword = async (password) => {
  return password; // Mengembalikan teks biasa sesuai permintaan
};

// exportData & importData & resetAllData dinonaktifkan di supabase (atau bisa disesuaikan nanti)
export const exportData = () => {
  return { exportedAt: new Date().toISOString(), note: 'Export dinonaktifkan di versi Supabase' };
};
export const importData = (data) => {
  console.log('Import dinonaktifkan');
};
export const resetAllData = async () => {
  console.log('Reset dinonaktifkan');
};
