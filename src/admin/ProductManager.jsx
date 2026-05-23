import { useState } from 'react';
import { Plus, Trash2, Edit2, AlertTriangle, Package } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { useProduct } from '../context/ProductContext';

export default function ProductManager() {
  const { products, add, update, remove } = useProduct();
  const [deleteId, setDeleteId] = useState(null);
  const [modalData, setModalData] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (!modalData.name || !modalData.price || !modalData.unit || !modalData.status) return;
    
    const parsedData = {
      ...modalData,
      price: Number(modalData.price),
    };

    if (modalData.id) {
      update(modalData.id, parsedData);
    } else {
      add(parsedData);
    }
    setModalData(null);
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <AdminLayout title="Manajemen Produk">
      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-jakarta font-bold text-lg text-gray-800">Hapus Produk?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">Produk akan dihapus secara permanen dari katalog BUMDes.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={() => { remove(deleteId); setDeleteId(null); }} className="flex-1 btn-danger justify-center">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-jakarta font-bold text-lg text-gray-800 mb-5">
              {modalData.id ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">Nama Produk *</label>
                <input required type="text" value={modalData.name} onChange={e => setModalData(p => ({ ...p, name: e.target.value }))} className="form-input" placeholder="Contoh: Beras Organik" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Harga (Rp) *</label>
                  <input required type="number" min="0" value={modalData.price} onChange={e => setModalData(p => ({ ...p, price: e.target.value }))} className="form-input" placeholder="Contoh: 15000" />
                </div>
                <div>
                  <label className="form-label">Satuan Jual *</label>
                  <input required type="text" value={modalData.unit} onChange={e => setModalData(p => ({ ...p, unit: e.target.value }))} className="form-input" placeholder="Contoh: kg, Liter, bungkus" />
                </div>
              </div>
              <div>
                <label className="form-label">Deskripsi Produk *</label>
                <textarea required rows={3} value={modalData.description} onChange={e => setModalData(p => ({ ...p, description: e.target.value }))} className="form-textarea" placeholder="Tuliskan deskripsi lengkap produk..." />
              </div>
              <div>
                <label className="form-label">URL Gambar (Unsplash/Imgur) *</label>
                <input required type="url" value={modalData.image} onChange={e => setModalData(p => ({ ...p, image: e.target.value }))} className="form-input" placeholder="https://..." />
                {modalData.image && (
                  <div className="mt-2 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img src={modalData.image} alt="Preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
              <div>
                <label className="form-label">Status Stok *</label>
                <select required value={modalData.status} onChange={e => setModalData(p => ({ ...p, status: e.target.value }))} className="form-input">
                  <option value="ready">Tersedia (Ready)</option>
                  <option value="empty">Habis (Out of Stock)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setModalData(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" className="flex-1 btn-primary justify-center">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-jakarta font-bold text-lg text-gray-800">Daftar Produk</h2>
          <p className="text-gray-500 text-sm">Kelola produk-produk unggulan BUMDes</p>
        </div>
        <button onClick={() => setModalData({ name: '', price: '', description: '', image: '', unit: 'kg', status: 'ready' })} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      {/* Table/List */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Belum ada produk di katalog.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setModalData(product)} className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(product.id)} className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.status === 'ready' ? 'Tersedia' : 'Habis'}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 text-base line-clamp-1">{product.name}</h4>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-baseline justify-between">
                  <span className="text-sm text-gray-400">Harga / {product.unit}</span>
                  <span className="font-bold text-bumdes-700 text-base">{formatPrice(product.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
