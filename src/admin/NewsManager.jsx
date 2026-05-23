import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, ToggleLeft, ToggleRight, AlertTriangle, X } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { useNews } from '../context/NewsContext';
import { formatDateShort } from '../utils/formatDate';

const PER_PAGE = 10;

export default function NewsManager() {
  const { news, deleteNews, toggleStatus } = useNews();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = news.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Semua' || (statusFilter === 'Terpublikasi' ? n.status === 'published' : n.status === 'draft');
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = () => { deleteNews(deleteId); setDeleteId(null); };

  return (
    <AdminLayout title="Manajemen Berita">
      {/* Confirm Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-jakarta font-bold text-lg text-gray-800">Hapus Berita?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">Tindakan ini tidak dapat dibatalkan. Berita akan dihapus secara permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={handleDelete} className="flex-1 btn-danger justify-center">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <Link to="/admin/berita/baru" className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Berita
        </Link>
        <div className="flex flex-wrap gap-2">
          {['Semua', 'Terpublikasi', 'Draft'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? 'bg-bumdes-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          id="news-manager-search"
          type="search"
          placeholder="Cari berita berdasarkan judul..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="form-input pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {paginated.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="font-medium">Tidak ada berita ditemukan.</p>
            {(search || statusFilter !== 'Semua') && (
              <button onClick={() => { setSearch(''); setStatusFilter('Semua'); }} className="mt-2 text-sm text-bumdes-600 hover:underline">Reset filter</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-600">Judul</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Kategori</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">Status</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Diperbarui</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(n => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800 line-clamp-1 max-w-xs">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.author}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="badge-green">{n.category}</span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className={`badge ${n.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {n.status === 'published' ? 'Terpublikasi' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{formatDateShort(n.updatedAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => toggleStatus(n.id)} title={n.status === 'published' ? 'Jadikan Draft' : 'Publikasikan'}
                          className={`p-1.5 rounded-lg transition-colors ${n.status === 'published' ? 'text-green-600 hover:bg-green-50' : 'text-amber-500 hover:bg-amber-50'}`}>
                          {n.status === 'published' ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                        <Link to={`/admin/berita/${n.id}/edit`} className="p-1.5 text-bumdes-600 hover:bg-bumdes-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {n.status === 'published' && (
                          <Link to={`/berita/${n.slug}`} target="_blank" className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Preview">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <button onClick={() => setDeleteId(n.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
            <span>{filtered.length} berita</span>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                Sebelumnya
              </button>
              <span className="px-3 py-1.5 bg-bumdes-50 text-bumdes-700 rounded-lg font-medium">{page}/{totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
