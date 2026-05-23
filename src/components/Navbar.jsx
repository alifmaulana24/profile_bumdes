import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Beranda', href: '/', type: 'route' },
  { label: 'Tentang Kami', href: '/#tentang', type: 'anchor' },
  { label: 'Katalog Produk', href: '/#katalog', type: 'anchor' },
  { label: 'Berita', href: '/berita', type: 'route' },
  { label: 'Kontak', href: '/#kontak', type: 'anchor' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleAnchorClick = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      setIsOpen(false);
      const id = href.replace('/#', '');
      if (location.pathname !== '/') {
        window.location.href = href;
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const isActive = (link) => {
    if (link.type === 'route' && !link.href.includes('#')) {
      return location.pathname === link.href;
    }
    return false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-bumdes-100'
          : 'bg-transparent'
          }`}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              aria-label="BUMDes Mitra Sejahtera - Beranda"
            >
              <div>
                <p className={`font-jakarta font-bold text-sm leading-tight transition-colors duration-200 ${scrolled ? 'text-bumdes-800' : 'text-white'
                  }`}>
                  BUMDes Mitra Sejahtera
                </p>
                <p className={`text-xs leading-tight transition-colors duration-200 ${scrolled ? 'text-bumdes-600' : 'text-green-200'
                  }`}>
                  Desa Cibogo Kec.Lembang
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive(link)
                      ? scrolled ? 'text-bumdes-700' : 'text-white'
                      : scrolled
                        ? 'text-gray-600 hover:text-bumdes-700 hover:bg-bumdes-50'
                        : 'text-green-100 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {link.label}
                    {isActive(link) && (
                      <span className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${scrolled ? 'bg-bumdes-700' : 'bg-white'
                        }`} />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <a
                href="/#kontak"
                onClick={(e) => handleAnchorClick(e, '/#kontak')}
                className={`hidden lg:inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${scrolled
                  ? 'bg-bumdes-700 text-white hover:bg-bumdes-800 shadow-bumdes'
                  : 'bg-white text-bumdes-700 hover:bg-green-50 shadow-lg'
                  }`}
              >
                Hubungi Kami
              </a>

              {/* Hamburger */}
              <button
                id="hamburger-btn"
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${scrolled
                  ? 'text-bumdes-700 hover:bg-bumdes-50'
                  : 'text-white hover:bg-white/10'
                  }`}
                aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={isOpen}
              >
                <span className={`transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0 absolute' : 'rotate-0 opacity-100'}`}>
                  <Menu className="w-6 h-6" />
                </span>
                <span className={`transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 absolute'}`}>
                  <X className="w-6 h-6" />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl lg:hidden transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
      >
        <div className="flex items-center justify-between p-4 border-b border-bumdes-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-bumdes-700 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-jakarta font-bold text-sm text-bumdes-800">BUMDes Mitra Sejahtera</p>
              <p className="text-xs text-bumdes-600">Desa Cibogo Kec.Lembang</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { handleAnchorClick(e, link.href); setIsOpen(false); }}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link)
                ? 'bg-bumdes-50 text-bumdes-700 font-semibold'
                : 'text-gray-700 hover:bg-bumdes-50 hover:text-bumdes-700'
                }`}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-bumdes-100 mt-3">
            <a
              href="/#kontak"
              onClick={(e) => { handleAnchorClick(e, '/#kontak'); setIsOpen(false); }}
              className="btn-primary w-full justify-center"
            >
              Hubungi Kami
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
