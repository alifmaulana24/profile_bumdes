import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-bumdes-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="relative inline-block mb-8">
            <div className="text-[120px] md:text-[160px] font-jakarta font-bold text-bumdes-100 leading-none select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl">🌾</span>
            </div>
          </div>
          <h1 className="font-jakarta font-bold text-3xl md:text-4xl text-bumdes-800 mb-4">Halaman Tidak Ditemukan</h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak tersedia. Mungkin sudah dipindahkan atau dihapus.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-primary">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
            <Link to="/berita" className="btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              Lihat Berita
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
