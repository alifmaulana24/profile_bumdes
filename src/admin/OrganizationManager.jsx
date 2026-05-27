import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Save, AlertCircle, Briefcase, BookOpen, Coins } from 'lucide-react';

export default function OrganizationManager() {
  const [members, setMembers] = useState({
    direktur: { id: 'direktur', name: '', role_label: 'Kepala Direktur' },
    sekretaris: { id: 'sekretaris', name: '', role_label: 'Sekretaris' },
    bendahara: { id: 'bendahara', name: '', role_label: 'Bendahara' }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data, error } = await supabase
        .from('organization')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const newData = { ...members };
        data.forEach(item => {
          if (newData[item.id]) {
            newData[item.id] = { ...newData[item.id], ...item };
          }
        });
        setMembers(newData);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal memuat data pengurus.' });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (id, field, value) => {
    setMembers(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const payload = Object.values(members).map(m => ({
        id: m.id,
        name: m.name,
        role_label: m.role_label,
        order_index: m.id === 'direktur' ? 1 : m.id === 'sekretaris' ? 2 : 3
      }));

      const { error } = await supabase
        .from('organization')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Struktur kepengurusan berhasil disimpan.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan data.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-bumdes-200 border-t-bumdes-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manajemen Pengurus</h2>
          <p className="text-sm text-gray-500 mt-1">Ubah nama-nama pengurus BUMDes yang akan tampil di halaman utama.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Struktur Inti BUMDes</h3>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Kepala Direktur */}
          <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="w-12 h-12 bg-white border border-gray-200 text-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-bumdes-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kepala Direktur</label>
              <input 
                type="text" 
                className="form-input w-full"
                value={members.direktur.name}
                onChange={(e) => handleChange('direktur', 'name', e.target.value)}
                placeholder="Masukkan nama Direktur"
              />
            </div>
          </div>

          {/* Sekretaris */}
          <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="w-12 h-12 bg-white border border-gray-200 text-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-bumdes-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sekretaris</label>
              <input 
                type="text" 
                className="form-input w-full"
                value={members.sekretaris.name}
                onChange={(e) => handleChange('sekretaris', 'name', e.target.value)}
                placeholder="Masukkan nama Sekretaris"
              />
            </div>
          </div>

          {/* Bendahara */}
          <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="w-12 h-12 bg-white border border-gray-200 text-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <Coins className="w-6 h-6 text-bumdes-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bendahara</label>
              <input 
                type="text" 
                className="form-input w-full"
                value={members.bendahara.name}
                onChange={(e) => handleChange('bendahara', 'name', e.target.value)}
                placeholder="Masukkan nama Bendahara"
              />
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 px-6"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
