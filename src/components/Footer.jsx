import { Link } from 'react-router-dom';
import { Leaf, Globe, Camera, Video, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { contactInfo } from '../data/contact';

const FooterLinks = [
  { label: 'Tentang Kami', href: '/#tentang' },
  { label: 'Katalog Produk', href: '/#katalog' },
  { label: 'Berita Terkini', href: '/berita' },
  { label: 'Hubungi Kami', href: '/#kontak' },
];

const Programs = [
  'Simpan Pinjam Petani',
  'Distribusi Pupuk Bersubsidi',
  'Pengolahan Hasil Panen',
  'Pemasaran Produk Pertanian',
  'Pelatihan & Penyuluhan',
  'Sewa Alat Pertanian',
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bumdes-800 text-white">
      {/* Main Footer */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div>
                <p className="font-jakarta font-bold text-lg leading-tight">Mitra Sejahtera</p>
                <p className="text-bumdes-300 text-xs">BUMDes</p>
              </div>
            </div>
            <p className="text-bumdes-200 text-sm leading-relaxed mb-5">
              Badan Usaha Milik Desa yang bergerak di sektor pertanian dan Hasil Pertanian untuk mewujudkan kemandirian ekonomi desa.
            </p>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-jakarta font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-bumdes-accent flex-shrink-0 mt-0.5" />
                <span className="text-bumdes-200 text-sm">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-bumdes-accent flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="text-bumdes-200 text-sm hover:text-white transition-colors">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-bumdes-700">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          <p className="text-bumdes-300 text-xs text-center sm:text-left">
            © {year} BUMDes Mitra Sejahtera. Seluruh hak cipta dilindungi.
          </p>
          <Link to="/admin/login" className="text-bumdes-400 text-xs hover:text-bumdes-200 transition-colors">
            Portal Admin
          </Link>
        </div>
      </div>
      <div className="text-bumdes-300 text-[8px] text-center sm:text-center">
        Made by Kelompok 9 Proyek Konsultasi 2026, Universitas Pendidikan Indonesia 😊
      </div>
    </footer>
  );
}
