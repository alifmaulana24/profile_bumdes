import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, Clock, ArrowLeft, ArrowRight, ChevronLeft, Share2, Copy, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarkdownRenderer from '../components/MarkdownRenderer';
import NewsCard from '../components/NewsCard';
import { getNewsBySlug, getPublishedNews } from '../utils/storage';
import { formatDate, estimateReadTime } from '../utils/formatDate';

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [news, setNews] = useState(null);
  const [allPublished, setAllPublished] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setNews(await getNewsBySlug(slug));
      setAllPublished(await getPublishedNews());
      setLoading(false);
    };
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center bg-bumdes-50">
          <div className="w-8 h-8 border-4 border-bumdes-200 border-t-bumdes-700 rounded-full animate-spin"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center bg-bumdes-50">
          <div className="text-center">
            <div className="text-7xl mb-6">📰</div>
            <h1 className="font-jakarta font-bold text-3xl text-bumdes-800 mb-3">Berita Tidak Ditemukan</h1>
            <p className="text-gray-500 mb-8">Berita yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Link to="/berita" className="btn-primary">Kembali ke Daftar Berita</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentIdx = allPublished.findIndex(n => n.slug === slug);
  const prevNews = currentIdx > 0 ? allPublished[currentIdx - 1] : null;
  const nextNews = currentIdx < allPublished.length - 1 ? allPublished[currentIdx + 1] : null;
  const related = allPublished.filter(n => n.slug !== slug && n.category === news.category).slice(0, 3);

  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { label: 'WhatsApp', color: 'bg-green-500 hover:bg-green-600', url: `https://wa.me/?text=${encodeURIComponent(news.title + ' ' + shareUrl)}` },
    { label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'Twitter/X', color: 'bg-gray-900 hover:bg-black', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero Thumbnail */}
        <div className="relative h-72 md:h-96 lg:h-[480px] overflow-hidden">
          <img src={news.image} alt={news.title} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=75'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-bumdes-900/80 via-bumdes-900/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container-custom">
              <nav aria-label="Breadcrumb" className="flex mb-3">
                <ol className="flex items-center gap-2 text-sm text-green-200">
                  <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
                  <li>/</li>
                  <li><Link to="/berita" className="hover:text-white transition-colors">Berita</Link></li>
                  <li>/</li>
                  <li className="text-white font-medium truncate max-w-[200px]">{news.title}</li>
                </ol>
              </nav>
              <span className="badge-green mb-3 inline-block">{news.category}</span>
              <h1 className="font-jakarta font-bold text-2xl md:text-3xl lg:text-4xl text-white leading-tight max-w-3xl">
                {news.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="container-custom py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Article */}
            <article className="lg:col-span-2">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 mb-6 border-b border-bumdes-100">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-bumdes-500" />{formatDate(news.date)}</span>
                <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-bumdes-500" />{news.author}</span>
                <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-bumdes-500" />{news.category}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-bumdes-500" />{estimateReadTime(news.content)}</span>
              </div>

              {/* Content */}
              <MarkdownRenderer content={news.content} />

              {/* Share */}
              <div className="mt-10 pt-6 border-t border-bumdes-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-600 mr-2">
                    <Share2 className="w-4 h-4" /> Bagikan:
                  </span>
                  {shareLinks.map(s => (
                    <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${s.color}`}>
                      {s.label}
                    </a>
                  ))}
                  <button onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-bumdes-200 text-bumdes-700 text-sm font-medium hover:bg-bumdes-50 transition-all">
                    {copied ? <><CheckCheck className="w-4 h-4" /> Tersalin!</> : <><Copy className="w-4 h-4" /> Salin Link</>}
                  </button>
                </div>
              </div>

              {/* Prev / Next */}
              <div className="grid sm:grid-cols-2 gap-4 mt-10">
                {prevNews ? (
                  <Link to={`/berita/${prevNews.slug}`}
                    className="flex items-start gap-3 p-4 rounded-xl border border-bumdes-100 hover:border-bumdes-300 hover:bg-bumdes-50 transition-all group">
                    <ArrowLeft className="w-5 h-5 text-bumdes-500 flex-shrink-0 mt-0.5 group-hover:-translate-x-1 transition-transform" />
                    <div><p className="text-xs text-gray-400 mb-1">Berita Sebelumnya</p>
                      <p className="text-sm font-semibold text-gray-700 line-clamp-2">{prevNews.title}</p></div>
                  </Link>
                ) : <div />}
                {nextNews ? (
                  <Link to={`/berita/${nextNews.slug}`}
                    className="flex items-end gap-3 p-4 rounded-xl border border-bumdes-100 hover:border-bumdes-300 hover:bg-bumdes-50 transition-all group text-right">
                    <div><p className="text-xs text-gray-400 mb-1">Berita Selanjutnya</p>
                      <p className="text-sm font-semibold text-gray-700 line-clamp-2">{nextNews.title}</p></div>
                    <ArrowRight className="w-5 h-5 text-bumdes-500 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : <div />}
              </div>

              <div className="mt-6">
                <Link to="/berita" className="btn-ghost">
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Berita
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {related.length > 0 && (
                <div className="bg-bumdes-50 rounded-2xl p-5 border border-bumdes-100">
                  <h3 className="font-jakarta font-bold text-lg text-bumdes-800 mb-4">Berita Terkait</h3>
                  <div className="space-y-4">
                    {related.map(r => <NewsCard key={r.id} news={r} variant="compact" />)}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
