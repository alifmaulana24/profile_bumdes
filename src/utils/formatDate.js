const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} dateInput - ISO string atau Date object
 * @param {boolean} withDay - Sertakan nama hari
 * @returns {string}
 */
export const formatDate = (dateInput, withDay = false) => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  if (withDay) {
    const dayName = DAYS[date.getDay()];
    return `${dayName}, ${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
};

/**
 * Format tanggal singkat (mis: 22 Mei 2026)
 */
export const formatDateShort = (dateInput) => formatDate(dateInput, false);

/**
 * Format tanggal relatif (mis: "2 hari lalu")
 */
export const formatDateRelative = (dateInput) => {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  if (diffWeek < 4) return `${diffWeek} minggu lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;
  return formatDate(date);
};

/**
 * Estimasi waktu baca dari konten Markdown
 * @param {string} content
 * @returns {string}
 */
export const estimateReadTime = (content) => {
  if (!content) return '1 menit baca';
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} menit baca`;
};

/**
 * Format tanggal untuk input date (YYYY-MM-DD)
 */
export const formatDateForInput = (dateInput) => {
  if (!dateInput) return new Date().toISOString().split('T')[0];
  const date = new Date(dateInput);
  return date.toISOString().split('T')[0];
};
