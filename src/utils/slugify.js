/**
 * Generate URL-friendly slug dari teks
 * @param {string} text
 * @returns {string}
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // hapus diakritik
    .replace(/[^a-z0-9\s-]/g, '')    // hanya huruf, angka, spasi, -
    .replace(/\s+/g, '-')            // spasi → tanda hubung
    .replace(/-+/g, '-')             // multiple dash → satu
    .trim()
    .replace(/^-|-$/g, '');          // trim dash di ujung
};

/**
 * Generate slug unik dengan suffix angka jika sudah ada
 * @param {string} text
 * @param {string[]} existingSlugs
 * @returns {string}
 */
export const slugifyUnique = (text, existingSlugs = []) => {
  const base = slugify(text);
  if (!existingSlugs.includes(base)) return base;
  let counter = 1;
  while (existingSlugs.includes(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
};
