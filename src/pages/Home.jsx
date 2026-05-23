import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Phone, Mail, MapPin, Send, CheckCircle, Users, Package, Calendar, Maximize2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsCard from '../components/NewsCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { contactInfo } from '../data/contact';
import { getPublishedNews, getSettings } from '../utils/storage';
import { useProduct } from '../context/ProductContext';

// ===== SCROLL ANIMATION HOOK =====
function useScrollAnimation(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.15 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, deps);
}

// ===== HERO SECTION =====
function HeroSection() {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="hero-section.jpg"
          alt="Lahan pertanian BUMDes Mitra Sejahtera"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-bumdes-900/90 via-bumdes-800/80 to-bumdes-700/70" />
      </div>

      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-bumdes-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-bumdes-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container-custom pt-24 pb-16 text-white">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6 animate-on-scroll">
            <span className="w-2 h-2 bg-bumdes-accent rounded-full animate-pulse" />
            Badan Usaha Milik Desa — Sektor Pertanian & Hasil Pertanian
          </div>

          <h1 className="font-jakarta font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 animate-on-scroll animate-delay-100">
            Bersama Tumbuh,{' '}
            <span className="text-bumdes-accent">Bersama Sejahtera</span>
          </h1>

          <p className="text-lg md:text-xl text-green-100 leading-relaxed mb-10 max-w-2xl animate-on-scroll animate-delay-200">
            BUMDes Mitra Sejahtera hadir untuk mengembangkan potensi pertanian desa melalui pengolahan bibit unggul, budidaya sayuran berkualitas, dan produk hasil pertanian guna meningkatkan nilai ekonomi serta kesejahteraan masyarakat secara berkelanjutan.
          </p>

          <div className="flex flex-wrap gap-4 animate-on-scroll animate-delay-300">
            <a
              href="#tentang"
              onClick={(e) => { e.preventDefault(); document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-primary bg-white text-bumdes-700 hover:bg-green-50 hover:shadow-lg"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/#katalog"
              onClick={(e) => { e.preventDefault(); document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="btn-secondary border-white text-white hover:bg-white hover:text-bumdes-700"
            >
              Lihat Produk Kami
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-10 border-t border-white/20 animate-on-scroll animate-delay-400 ">
            {[
              { label: 'Tahun Berdiri', end: 2017, suffix: '' },
              { label: ' Lahan', end: 14000, suffix: ' m' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-jakarta font-bold text-3xl md:text-4xl text-bumdes-300">
                  <AnimatedCounter end={s.end} suffix={s.suffix} />
                </div>
                <div className="text-green-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#tentang"
        onClick={(e) => { e.preventDefault(); document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' }); }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll ke bawah"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
}

// ===== TENTANG SECTION =====
function TentangSection() {
  return (
    <section id="tentang" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative animate-on-scroll order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-bumdes-lg">
              <img
                src="about.jpeg"
                alt="Petani mitra BUMDes Mitra Sejahtera"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bumdes-900/30 to-transparent" />
            </div>
            {/* Floating Card */}
            <div className="absolute -top-6 -left-6 bg-bumdes-700 rounded-2xl p-4 shadow-xl max-w-[180px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bumdes-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-jakarta font-bold text-xl text-white">2017</div>
                  <div className="text-xs text-green-200">Tahun Berdiri</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="section-subtitle mb-3 animate-on-scroll">Tentang Kami</p>
            <h2 className="section-title mb-6 animate-on-scroll animate-delay-100">
              Pertanian Terpadu untuk Ketahanan Pangan dan Ekonomi Desa
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 animate-on-scroll animate-delay-200">
              BUMDes Mitra Sejahtera didirikan pada tahun 2017 sebagai wujud komitmen pemerintah desa dalam memperkuat kemandirian ekonomi masyarakat melalui pengembangan sektor pertanian terpadu, khususnya pada pengolahan bibit unggul, budidaya sayuran, dan hasil pertanian.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 animate-on-scroll animate-delay-300">
              Dengan mengoptimalkan potensi lahan dan sumber daya yang ada, BUMDes Mitra Sejahtera berfokus pada produksi bibit berkualitas serta budidaya sayuran segar yang sehat dan bernilai jual tinggi. Setiap proses dikelola dengan pendekatan pertanian yang lebih modern untuk meningkatkan hasil panen dan mendukung ketahanan pangan desa.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 animate-on-scroll animate-delay-300">
              {[
                { icon: Package, label: 'Produk Hasil Pertanian', end: 4, suffix: '+', color: 'bg-lime-50 text-lime-700' },
                { icon: Calendar, label: 'Meter Lahan', end: 14000, suffix: ' m', color: 'bg-emerald-50 text-emerald-700' },
                { icon: CheckCircle, label: 'Jenis Sayuran', end: 5, suffix: '', color: 'bg-teal-50 text-teal-700' },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="font-jakarta font-bold text-2xl text-bumdes-800">
                    <AnimatedCounter end={s.end} suffix={s.suffix} />
                  </div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-bumdes-50 rounded-2xl p-5 border border-bumdes-100 animate-on-scroll animate-delay-400">
              <h3 className="font-jakarta font-bold text-bumdes-800 mb-3">Visi Kami</h3>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                “Menjadi lembaga usaha desa unggul dalam pengembangan bibit dan sayuran untuk mewujudkan kemandirian ekonomi masyarakat melalui pertanian berkelanjutan dan transparan.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ===== KATALOG SECTION =====
function KatalogSection() {
  const { products } = useProduct();
  const [orderProduct, setOrderProduct] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', qty: 1, notes: '' });
  const [errors, setErrors] = useState({});

  const formatPrice = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleOpenOrder = (product) => {
    setOrderProduct(product);
    setForm({ name: '', address: '', qty: 1, notes: '' });
    setErrors({});
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama lengkap wajib diisi';
    if (form.qty < 1) errs.qty = 'Jumlah pesanan minimal 1';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const totalPrice = orderProduct.price * form.qty;
    const formattedTotal = formatPrice(totalPrice);
    const formattedPrice = formatPrice(orderProduct.price);

    const whatsappMessage = `
*PESANAN BARU BUMDes Mitra Sejahtera*
━━━━━━━━━━━━━━━━━━━━
*Produk:* ${orderProduct.name}
*Harga:* ${formattedPrice} / ${orderProduct.unit}
*Jumlah:* ${form.qty} ${orderProduct.unit}
*Total:* ${formattedTotal}

*Detail Pembeli:*
• *Nama:* ${form.name}
${form.notes ? `• *Catatan:* ${form.notes}` : ''}

━━━━━━━━━━━━━━━━━━━━
_Mohon segera diproses, terima kasih!_
    `.trim();

    const settings = getSettings();
    const phoneNumber = settings.whatsapp || '62895405628686';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
    setOrderProduct(null);
  };

  return (
    <section id="katalog" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="section-subtitle mb-3 animate-on-scroll">Pilihan Unggulan</p>
          <h2 className="section-title mb-4 animate-on-scroll animate-delay-100">Katalog Produk BUMDes</h2>
          <p className="text-gray-600 animate-on-scroll animate-delay-200">
            Dukung perekonomian lokal dengan membeli produk-produk berkualitas hasil pertanian BUMDes Cibogo.
          </p>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-bumdes-50 rounded-2xl border border-bumdes-100 max-w-md mx-auto">
            <Package className="w-12 h-12 text-bumdes-400 mx-auto mb-3" />
            <h3 className="font-jakarta font-bold text-lg text-bumdes-800 mb-1">Produk Tidak Ditemukan</h3>
            <p className="text-gray-500 text-sm">Belum ada produk di katalog.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((item, i) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between animate-on-scroll"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.status === 'ready' ? 'Tersedia' : 'Habis'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-jakarta font-bold text-lg text-gray-800 mt-1 line-clamp-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-3 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-5">
                    <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between mb-4">
                      <span className="text-xs text-gray-400">Harga ({item.unit})</span>
                      <span className="font-bold text-bumdes-700 text-lg">{formatPrice(item.price)}</span>
                    </div>

                    {item.status === 'ready' ? (
                      <button
                        onClick={() => handleOpenOrder(item)}
                        className="w-full py-2.5 bg-bumdes-700 text-white rounded-xl text-sm font-semibold hover:bg-bumdes-800 transition-colors shadow-bumdes flex items-center justify-center gap-2"
                      >
                        Pesan Sekarang
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        Stok Habis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Modal */}
      {orderProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-jakarta font-bold text-lg text-gray-800">Formulir Pemesanan</h3>
              <button
                onClick={() => setOrderProduct(null)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-bumdes-50 rounded-xl p-3.5 border border-bumdes-100 mb-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={orderProduct.image} alt={orderProduct.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 leading-tight">{orderProduct.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{formatPrice(orderProduct.price)} / {orderProduct.unit}</p>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="form-label text-xs">Nama Lengkap *</label>
                <input
                  required
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={form.name}
                  onChange={e => {
                    setForm(p => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors(p => ({ ...p, name: null }));
                  }}
                  className={`form-input py-2 text-sm ${errors.name ? 'border-red-400 focus:border-red-400' : ''}`}
                />
                {errors.name && <p className="form-error text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="form-label text-xs">Jumlah Pesanan ({orderProduct.unit}) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.qty}
                    onChange={e => {
                      setForm(p => ({ ...p, qty: Math.max(1, parseInt(e.target.value) || 1) }));
                    }}
                    className="form-input py-2 text-sm"
                  />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Harga</p>
                  <p className="font-jakarta font-bold text-bumdes-700 text-lg mt-0.5">
                    {formatPrice(orderProduct.price * form.qty)}
                  </p>
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Pengiriman sore hari, atau kemasan plastik double"
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="form-input py-2 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setOrderProduct(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  Kirim via WA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// ===== BERITA SECTION =====
function BeritaSection() {
  const news = getPublishedNews().slice(0, 3);

  return (
    <section id="berita" className="section-padding bg-bumdes-50">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-subtitle mb-2 animate-on-scroll">Informasi Terkini</p>
            <h2 className="section-title animate-on-scroll animate-delay-100">Berita Terbaru</h2>
          </div>
          <Link to="/berita" className="btn-secondary text-sm flex-shrink-0 animate-on-scroll">
            Lihat Semua Berita
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-bumdes-100">
            <div className="text-5xl mb-4">📰</div>
            <h3 className="font-jakarta font-bold text-xl text-bumdes-800 mb-2">Belum Ada Berita</h3>
            <p className="text-gray-500">Berita akan segera dipublikasikan. Silakan kunjungi kembali nanti.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <div key={item.id} className="animate-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                <NewsCard news={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ===== KONTAK SECTION =====
function KontakSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (!form.email.trim()) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.message.trim()) e.message = 'Pesan wajib diisi';
    else if (form.message.length < 10) e.message = 'Pesan minimal 10 karakter';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});

    const settings = getSettings();
    const phoneNumber = settings.whatsapp || '62895405628686'; // Format internasional tanpa +

    const message = `
  ➤ *INBOX WEBSITE BUMDes*

  ━━━━━━━━━━━━━━
  ➤ DATA PENGIRIM
  ━━━━━━━━━━━━━━
  • Nama   : ${form.name}
  • Email  : ${form.email}
  • Waktu  : ${new Date().toLocaleString('id-ID')}

  ━━━━━━━━━━━━━━
  ➤ PESAN
  ━━━━━━━━━━━━━━
  _${form.message}_
  `.trim();

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');

    setSent(true);
    setForm({ name: '', email: '', message: '' });

    setTimeout(() => setSent(false), 5000);
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <section id="kontak" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-subtitle mb-3 animate-on-scroll">Hubungi Kami</p>
          <h2 className="section-title mb-4 animate-on-scroll animate-delay-100">Ada Pertanyaan? Kami Siap Membantu</h2>
          <p className="text-gray-600 animate-on-scroll animate-delay-200">Hubungi kami untuk informasi lebih lanjut tentang program dan layanan BUMDes Mitra Sejahtera.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="animate-on-scroll">
            <div className="bg-white rounded-2xl border border-bumdes-100 shadow-md p-6 md:p-8">
              <h3 className="font-jakarta font-bold text-xl text-bumdes-800 mb-6">Kirim Pesan</h3>
              {sent && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 mb-6">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-medium">Pesan berhasil dikirim! Kami akan segera merespons.</p>
                </div>
              )}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="form-label">Nama Lengkap</label>
                  <input id="contact-name" type="text" placeholder="Masukkan nama Anda" value={form.name} onChange={handleChange('name')} className={`form-input ${errors.name ? 'border-red-400 focus:border-red-400' : ''}`} />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="form-label">Alamat Email</label>
                  <input id="contact-email" type="email" placeholder="contoh@email.com" value={form.email} onChange={handleChange('email')} className={`form-input ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`} />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="contact-message" className="form-label">Pesan</label>
                  <textarea id="contact-message" rows={5} placeholder="Tuliskan pesan atau pertanyaan Anda..." value={form.message} onChange={handleChange('message')} className={`form-textarea ${errors.message ? 'border-red-400 focus:border-red-400' : ''}`} />
                  {errors.message && <p className="form-error">{errors.message}</p>}
                </div>
                <button type="submit" id="contact-submit" className="btn-primary w-full justify-center">
                  <Send className="w-4 h-4" />
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6 animate-on-scroll animate-delay-200">
            {/* Info Cards */}
            {[
              { icon: MapPin, label: 'Alamat', value: contactInfo.address, color: 'bg-green-50 text-bumdes-700' }, ,
              { icon: Mail, label: 'Email', value: contactInfo.email, color: 'bg-emerald-50 text-emerald-700', href: `mailto:${contactInfo.email}` },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl bg-bumdes-50 border border-bumdes-100">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-bumdes-600 uppercase tracking-wider mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-gray-700 text-sm hover:text-bumdes-700 transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-gray-700 text-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
            {/* Maps */}
            <div className="rounded-2xl overflow-hidden border border-bumdes-100 shadow-md h-80">
              <iframe
                title="Lokasi BUMDes Mitra Sejahtera"
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d500!2d${contactInfo.maps.lng}!3d${contactInfo.maps.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1716364800000`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== HOME PAGE =====
export default function Home() {
  const { products } = useProduct();
  useScrollAnimation([products]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TentangSection />
        <KatalogSection />
        <BeritaSection />
        <KontakSection />
      </main>
      <Footer />
    </>
  );
}
