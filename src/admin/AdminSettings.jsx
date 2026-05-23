import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Download, Upload, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import { useNews } from '../context/NewsContext';
import {
  getCategories, saveCategories, getCredentials, saveCredentials,
  hashPassword, exportData, importData, resetAllData, getSettings, saveSettings
} from '../utils/storage';

export default function AdminSettings() {
  const { session } = useAuth();
  const { refresh } = useNews();
  const [toast, setToast] = useState(null);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [creds, setCreds] = useState({ username: '', name: '' });
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '', newName: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [resetConfirm, setResetConfirm] = useState('');
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setCategories(await getCategories());
      setSettings(await getSettings());
      setCreds(await getCredentials());
      setLoading(false);
    };
    loadData();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ===== CATEGORIES =====
  const handleAddCat = async () => {
    const trimmed = newCat.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    const updated = [...categories, trimmed];
    setCategories(updated);
    await saveCategories(updated);
    setNewCat('');
    showToast('Kategori ditambahkan.');
  };

  const handleDeleteCat = async (cat) => {
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    await saveCategories(updated);
    showToast('Kategori dihapus.');
  };

  // ===== SETTINGS =====
  const handleSaveSettings = async () => {
    await saveSettings(settings);
    showToast('Pengaturan website berhasil diperbarui!');
  };

  // ===== PASSWORD =====
  const handleSavePw = async () => {
    const e = {};
    if (!pwForm.newName.trim() && !pwForm.newPassword) { showToast('Tidak ada perubahan.', 'info'); return; }
    if (pwForm.newPassword) {
      if (!pwForm.currentPassword) e.currentPassword = 'Password saat ini wajib diisi';
      if (pwForm.newPassword.length < 6) e.newPassword = 'Password minimal 6 karakter';
      if (pwForm.newPassword !== pwForm.confirmPassword) e.confirmPassword = 'Konfirmasi password tidak cocok';
    }
    if (Object.keys(e).length > 0) { setPwErrors(e); return; }

    const currentCreds = await getCredentials();
    if (pwForm.currentPassword) {
      const hashedCurrent = await hashPassword(pwForm.currentPassword);
      if (hashedCurrent !== currentCreds.password) { setPwErrors({ currentPassword: 'Password saat ini salah' }); return; }
    }

    const updates = { ...currentCreds };
    if (pwForm.newName.trim()) updates.name = pwForm.newName.trim();
    if (pwForm.newPassword) updates.password = await hashPassword(pwForm.newPassword);

    await saveCredentials(updates);
    setCreds(updates);
    setPwErrors({});
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '', newName: '' });
    showToast('Pengaturan akun berhasil diperbarui!');
  };

  // ===== EXPORT =====
  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bumdes-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data berhasil diekspor!');
  };

  // ===== IMPORT =====
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        await importData(data);
        await refresh();
        showToast('Data berhasil diimpor!');
      } catch {
        showToast('File tidak valid.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ===== RESET =====
  const handleReset = async () => {
    if (resetConfirm !== 'RESET') return;
    await resetAllData();
    await refresh();
    setShowReset(false);
    setResetConfirm('');
    showToast('Semua data telah direset ke default.', 'info');
  };

  if (loading) {
    return (
      <AdminLayout title="Pengaturan">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 text-bumdes-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pengaturan">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white transition-all ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-blue-600' : 'bg-green-600'}`}>
          <CheckCircle className="w-5 h-5" /> {toast.msg}
        </div>
      )}

      {/* Reset Modal */}
      {showReset && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-jakarta font-bold text-lg text-gray-800">Reset Semua Data</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Seluruh data berita akan dihapus dan dikembalikan ke kondisi awal. Tindakan ini <strong>tidak dapat dibatalkan</strong>.</p>
            <p className="text-sm text-gray-600 mb-2">Ketik <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-red-600">RESET</code> untuk konfirmasi:</p>
            <input type="text" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)}
              className="form-input mb-4" placeholder="Ketik RESET" />
            <div className="flex gap-3">
              <button onClick={() => { setShowReset(false); setResetConfirm(''); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={handleReset} disabled={resetConfirm !== 'RESET'} className="flex-1 btn-danger justify-center disabled:opacity-40 disabled:cursor-not-allowed">Reset Data</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        {/* Account */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-jakarta font-bold text-lg text-gray-800 mb-5">Pengaturan Akun</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div><p className="text-xs text-gray-400 mb-1">Username</p><p className="font-medium text-gray-700">{creds?.username}</p></div>
              <div><p className="text-xs text-gray-400 mb-1">Nama Tampilan</p><p className="font-medium text-gray-700">{creds?.name}</p></div>
            </div>
            <div>
              <label htmlFor="settings-name" className="form-label">Nama Tampilan Baru</label>
              <input id="settings-name" type="text" placeholder="Nama baru (opsional)" value={pwForm.newName} onChange={e => setPwForm(p => ({ ...p, newName: e.target.value }))} className="form-input" />
            </div>
            <div>
              <label htmlFor="settings-current-pw" className="form-label">Password Saat Ini</label>
              <input id="settings-current-pw" type="password" placeholder="Wajib diisi jika mengubah password" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} className={`form-input ${pwErrors.currentPassword ? 'border-red-400' : ''}`} />
              {pwErrors.currentPassword && <p className="form-error">{pwErrors.currentPassword}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="settings-new-pw" className="form-label">Password Baru</label>
                <input id="settings-new-pw" type="password" placeholder="Min. 6 karakter" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} className={`form-input ${pwErrors.newPassword ? 'border-red-400' : ''}`} />
                {pwErrors.newPassword && <p className="form-error">{pwErrors.newPassword}</p>}
              </div>
              <div>
                <label htmlFor="settings-confirm-pw" className="form-label">Konfirmasi Password</label>
                <input id="settings-confirm-pw" type="password" placeholder="Ulangi password baru" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} className={`form-input ${pwErrors.confirmPassword ? 'border-red-400' : ''}`} />
                {pwErrors.confirmPassword && <p className="form-error">{pwErrors.confirmPassword}</p>}
              </div>
            </div>
            <button onClick={handleSavePw} className="btn-primary">
              <Save className="w-4 h-4" /> Simpan Pengaturan Akun
            </button>
          </div>
        </div>

        {/* Website Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-jakarta font-bold text-lg text-gray-800 mb-5">Pengaturan Website & Kontak</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="settings-wa" className="form-label">Nomor WhatsApp Penerima Pesan</label>
              <input 
                id="settings-wa" 
                type="text" 
                placeholder="Contoh: 6281234567890 (Gunakan 62, tanpa + atau 0)" 
                value={settings?.whatsapp || ''} 
                onChange={e => setSettings(p => ({ ...p, whatsapp: e.target.value }))} 
                className="form-input" 
              />
              <p className="text-xs text-gray-500 mt-1">Nomor ini akan menerima pesan dari form Hubungi Kami dan pesanan produk.</p>
            </div>
            <button onClick={handleSaveSettings} className="btn-primary mt-2">
              <Save className="w-4 h-4" /> Simpan Pengaturan Website
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-jakarta font-bold text-lg text-gray-800 mb-5">Kelola Kategori Berita</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="Nama kategori baru" value={newCat} onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCat()} className="form-input flex-1" />
            <button onClick={handleAddCat} className="btn-primary px-4">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div key={cat} className="flex items-center gap-1.5 bg-bumdes-50 border border-bumdes-100 text-bumdes-700 rounded-lg px-3 py-1.5 text-sm">
                <span>{cat}</span>
                <button onClick={() => handleDeleteCat(cat)} className="text-bumdes-400 hover:text-red-500 transition-colors ml-1" aria-label={`Hapus kategori ${cat}`}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Backup */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-jakarta font-bold text-lg text-gray-800 mb-5">Backup & Restore Data</h2>
          <div className="space-y-3">
            <button onClick={handleExport} className="btn-primary w-full justify-center opacity-50 cursor-not-allowed">
              <Download className="w-4 h-4" /> Export Dinonaktifkan (Supabase)
            </button>
            <button className="btn-secondary w-full justify-center opacity-50 cursor-not-allowed">
              <Upload className="w-4 h-4" /> Import Dinonaktifkan (Supabase)
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <h2 className="font-jakarta font-bold text-lg text-red-700 mb-2">Zona Berbahaya</h2>
          <p className="text-sm text-gray-500 mb-4">Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
          <button onClick={() => setShowReset(true)} className="btn-danger opacity-50 cursor-not-allowed">
            <RefreshCw className="w-4 h-4" /> Reset Dinonaktifkan (Supabase)
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
