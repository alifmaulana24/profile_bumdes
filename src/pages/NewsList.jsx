import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsCard from '../components/NewsCard';
import { getPublishedNews, getCategories } from '../utils/storage';

const PER_PAGE = 9;

export default function NewsList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [page, setPage] = useState(1);

  const [allNews, setAllNews] = useState([]);
  const [categories, setCategories] = useState(['Semua']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setAllNews(await getPublishedNews());
      setCategories(['Semua', ...(await getCategories())]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return allNews.filter(n => {
      const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.excerpt?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'Semua' || n.category === category;
      return matchSearch && matchCat;
    });
  }, [allNews, search, category]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleCategory = (cat) => { setCategory(cat); setPage(1); };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-bumdes-800 to-bumdes-700 py-16 text-white">
          <div className="container-custom text-center">
            <nav aria-label="Breadcrumb" className="flex justify-center mb-4">
              <ol className="flex items-center gap-2 text-sm text-green-200">
                <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
                <li>/</li>
                <li className="text-white font-medium">Berita</li>
              </ol>
            </nav>
            <h1 className="font-jakarta font-bold text-4xl md:text-5xl mb-4">Berita & Informasi</h1>
            <p className="text-green-100 text-lg max-w-xl mx-auto">
              Ikuti perkembangan terbaru kegiatan dan program BUMDes Mitra Sejahtera
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="bg-white sticky top-16 md:top-20 z-30 border-b border-bumdes-100 shadow-sm">
          <div className="container-custom py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="news-search"
                  type="search"
                  placeholder="Cari berita..."
                  value={search}
                  onChange={handleSearch}
                  className="form-input pl-10 py-2.5"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      category === cat
                        ? 'bg-bumdes-700 text-white'
                        : 'bg-bumdes-50 text-bumdes-700 hover:bg-bumdes-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-bumdes-50">
          <div className="container-custom">
            {/* Result count */}
            <p className="text-sm text-gray-500 mb-6">
              Menampilkan <strong className="text-bumdes-700">{filtered.length}</strong> berita
              {search && <> untuk kata kunci "<strong>{search}</strong>"</>}
              {category !== 'Semua' && <> dalam kategori "<strong>{category}</strong>"</>}
            </p>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-8 h-8 border-4 border-bumdes-200 border-t-bumdes-700 rounded-full animate-spin"></div>
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-bumdes-100">
                <Newspaper className="w-16 h-16 text-bumdes-200 mx-auto mb-4" />
                <h3 className="font-jakarta font-bold text-xl text-bumdes-800 mb-2">Berita Tidak Ditemukan</h3>
                <p className="text-gray-500 mb-6">Coba ubah kata kunci atau filter kategori.</p>
                <button onClick={() => { setSearch(''); setCategory('Semua'); setPage(1); }} className="btn-primary">
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map(n => <NewsCard key={n.id} news={n} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-lg border border-bumdes-200 flex items-center justify-center text-bumdes-700 hover:bg-bumdes-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      page === p ? 'bg-bumdes-700 text-white' : 'border border-bumdes-200 text-bumdes-700 hover:bg-bumdes-50'
                    }`}
                    aria-label={`Halaman ${p}`}
                    aria-current={page === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-lg border border-bumdes-200 flex items-center justify-center text-bumdes-700 hover:bg-bumdes-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
