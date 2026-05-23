import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Send, Eye, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { useNews } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { slugify, slugifyUnique } from '../utils/slugify';
import { getCategories } from '../utils/storage';
import { formatDateForInput } from '../utils/formatDate';

const EMPTY = {
  title: '', slug: '', category: '', image: '', author: '',
  date: formatDateForInput(), status: 'draft', excerpt: '', content: '',
};

export default function NewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { news, addNews, updateNews, getById } = useNews();
  const { session } = useAuth();
  const categories = getCategories();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(() => {
    if (isEdit) {
      const existing = news.find(n => n.id === id);
      return existing ? { ...existing, date: formatDateForInput(existing.date) } : EMPTY;
    }
    return { ...EMPTY, author: session?.name || 'Admin BUMDes' };
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  // Auto-generate slug from title (only for new)
  useEffect(() => {
    if (!isEdit && form.title) {
      const existingSlugs = news.filter(n => n.id !== id).map(n => n.slug);
      setForm(p => ({ ...p, slug: slugifyUnique(p.title, existingSlugs) }));
    }
  }, [form.title, isEdit]);

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Judul wajib diisi';
    if (!form.slug.trim()) e.slug = 'Slug wajib diisi';
    if (!form.category) e.category = 'Kategori wajib dipilih';
    if (!form.image.trim()) e.image = 'URL thumbnail wajib diisi';
    if (!form.author.trim()) e.author = 'Penulis wajib diisi';
    if (!form.date) e.date = 'Tanggal wajib diisi';
    if (!form.content.trim()) e.content = 'Konten wajib diisi';

    // Slug uniqueness
    const slugConflict = news.find(n => n.slug === form.slug && n.id !== id);
    if (slugConflict) e.slug = 'Slug sudah digunakan berita lain';

    return e;
  };

  const handleSave = (status) => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const data = { ...form, status };
    if (isEdit) {
      updateNews(id, data);
    } else {
      addNews(data);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate('/admin/berita'); }, 1200);
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Berita' : 'Tambah Berita Baru'}>
      {saved && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg animate-slide-up">
          <CheckCircle className="w-5 h-5" /> Berita berhasil disimpan!
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Panel */}
        <div className="space-y-5">
          {/* Judul */}
          <div>
            <label htmlFor="form-title" className="form-label">Judul Berita *</label>
            <input id="form-title" type="text" placeholder="Masukkan judul berita" value={form.title} onChange={set('title')} className={`form-input ${errors.title ? 'border-red-400' : ''}`} maxLength={200} />
            {errors.title && <p className="form-error"><AlertCircle className="w-3.5 h-3.5" />{errors.title}</p>}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="form-slug" className="form-label">Slug (URL) *</label>
            <input id="form-slug" type="text" placeholder="judul-berita-anda" value={form.slug} onChange={set('slug')} className={`form-input font-mono text-sm ${errors.slug ? 'border-red-400' : ''}`} />
            {errors.slug ? <p className="form-error"><AlertCircle className="w-3.5 h-3.5" />{errors.slug}</p>
              : <p className="text-xs text-gray-400 mt-1">URL: /berita/{form.slug || '...'}</p>}
          </div>

          {/* Kategori & Penulis */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-category" className="form-label">Kategori *</label>
              <select id="form-category" value={form.category} onChange={set('category')} className={`form-input ${errors.category ? 'border-red-400' : ''}`}>
                <option value="">Pilih kategori</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="form-error"><AlertCircle className="w-3.5 h-3.5" />{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="form-author" className="form-label">Penulis *</label>
              <input id="form-author" type="text" value={form.author} onChange={set('author')} className={`form-input ${errors.author ? 'border-red-400' : ''}`} />
              {errors.author && <p className="form-error"><AlertCircle className="w-3.5 h-3.5" />{errors.author}</p>}
            </div>
          </div>

          {/* Tanggal & Status */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-date" className="form-label">Tanggal Publikasi *</label>
              <input id="form-date" type="date" value={form.date} onChange={set('date')} className={`form-input ${errors.date ? 'border-red-400' : ''}`} />
              {errors.date && <p className="form-error"><AlertCircle className="w-3.5 h-3.5" />{errors.date}</p>}
            </div>
            <div>
              <label className="form-label">Status</label>
              <div className="flex gap-3 mt-1">
                {[['draft', 'Draft'], ['published', 'Terpublikasi']].map(([val, label]) => (
                  <label key={val} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border-2 rounded-xl cursor-pointer transition-all text-sm font-medium ${form.status === val ? 'border-bumdes-600 bg-bumdes-50 text-bumdes-700' : 'border-gray-200 text-gray-500 hover:border-bumdes-300'}`}>
                    <input type="radio" name="status" value={val} checked={form.status === val} onChange={set('status')} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label htmlFor="form-image" className="form-label">URL Thumbnail *</label>
            <input id="form-image" type="url" placeholder="https://..." value={form.image} onChange={set('image')} className={`form-input ${errors.image ? 'border-red-400' : ''}`} />
            {errors.image && <p className="form-error"><AlertCircle className="w-3.5 h-3.5" />{errors.image}</p>}
            {form.image && !errors.image && (
              <div className="mt-2 rounded-xl overflow-hidden aspect-video w-full max-w-sm border border-bumdes-100">
                <img src={form.image} alt="Preview thumbnail" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* Ringkasan */}
          <div>
            <label htmlFor="form-excerpt" className="form-label">Ringkasan <span className="text-gray-400 font-normal">(opsional)</span></label>
            <textarea id="form-excerpt" rows={3} maxLength={300} placeholder="Ringkasan singkat untuk preview berita..." value={form.excerpt} onChange={set('excerpt')} className="form-textarea" />
            <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/300 karakter</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2 sticky bottom-0 bg-gray-50 pb-2">
            <button onClick={() => handleSave('draft')} className="btn-secondary flex-1 sm:flex-none justify-center">
              <Save className="w-4 h-4" /> Simpan Draft
            </button>
            <button onClick={() => handleSave('published')} className="btn-primary flex-1 sm:flex-none justify-center">
              <Send className="w-4 h-4" /> Publikasikan
            </button>
          </div>
        </div>

        {/* Editor / Preview Panel */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => setPreview(false)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!preview ? 'bg-bumdes-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <Edit3 className="w-4 h-4" /> Editor
            </button>
            <button onClick={() => setPreview(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${preview ? 'bg-bumdes-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>

          {!preview ? (
            <div className="flex-1 flex flex-col">
              <label htmlFor="form-content" className="form-label">Konten Markdown *</label>
              <textarea
                id="form-content"
                value={form.content}
                onChange={set('content')}
                placeholder="## Judul Artikel&#10;&#10;Tulis konten berita Anda di sini menggunakan **Markdown**..."
                className={`form-textarea font-mono text-sm flex-1 min-h-[500px] ${errors.content ? 'border-red-400' : ''}`}
              />
              {errors.content && <p className="form-error mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.content}</p>}
              <p className="text-xs text-gray-400 mt-1">Mendukung: **bold**, *italic*, ## heading, - list, &gt; blockquote, `code`, [link](url), ![alt](url)</p>
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-2xl border border-bumdes-100 p-6 min-h-[500px] overflow-y-auto">
              {form.content ? (
                <MarkdownRenderer content={form.content} />
              ) : (
                <p className="text-gray-400 italic text-center mt-20">Tulis konten di tab Editor untuk melihat preview.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
