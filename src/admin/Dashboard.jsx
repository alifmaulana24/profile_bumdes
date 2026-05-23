import { Link } from 'react-router-dom';
import { Plus, Newspaper, CheckCircle, FileEdit, Edit2, Trash2, Eye } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { useNews } from '../context/NewsContext';
import { formatDateShort } from '../utils/formatDate';

export default function Dashboard() {
  const { news, published, drafts } = useNews();
  const recent = [...news].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  const stats = [
    { label: 'Total Berita', value: news.length, icon: Newspaper, color: 'text-blue-600 bg-blue-50', border: 'border-blue-100' },
    { label: 'Terpublikasi', value: published.length, icon: CheckCircle, color: 'text-green-600 bg-green-50', border: 'border-green-100' },
    { label: 'Draft', value: drafts.length, icon: FileEdit, color: 'text-amber-600 bg-amber-50', border: 'border-amber-100' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`stat-card flex items-center gap-4 border ${s.border}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-jakarta font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link to="/admin/berita/baru" id="btn-tambah-berita" className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Berita Baru
        </Link>
        <Link to="/admin/berita" className="btn-secondary">
          <Newspaper className="w-4 h-4" /> Kelola Semua Berita
        </Link>
      </div>

      {/* Recent Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-jakarta font-bold text-lg text-gray-800">Berita Terbaru</h2>
        </div>
        {recent.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Belum ada berita. <Link to="/admin/berita/baru" className="text-bumdes-600 hover:underline">Tambah sekarang</Link></p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-600">Judul</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Kategori</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">Status</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Diperbarui</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map(n => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800 line-clamp-1 max-w-[200px]">{n.title}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="badge-green">{n.category}</span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className={`badge ${n.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {n.status === 'published' ? 'Terpublikasi' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-gray-400">{formatDateShort(n.updatedAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/berita/${n.id}/edit`} className="p-1.5 text-bumdes-600 hover:bg-bumdes-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {n.status === 'published' && (
                          <Link to={`/berita/${n.slug}`} target="_blank" className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Preview">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
