import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { formatDateShort } from '../utils/formatDate';

export default function NewsCard({ news, variant = 'default' }) {
  if (!news) return null;

  const { slug, title, excerpt, image, category, author, date } = news;

  if (variant === 'compact') {
    return (
      <Link to={`/berita/${slug}`} className="flex gap-3 group">
        <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=60'; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-bumdes-600 font-medium mb-1">{category}</p>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-bumdes-700 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{formatDateShort(date)}</p>
        </div>
      </Link>
    );
  }

  return (
    <article className="card card-hover group flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=75'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 left-3 badge-green shadow-sm">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta */}
        <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateShort(date)}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {author}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-jakarta font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-bumdes-700 transition-colors">
          {title}
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-500 text-sm line-clamp-3 flex-1">
            {excerpt}
          </p>
        )}

        {/* CTA */}
        <Link
          to={`/berita/${slug}`}
          className="mt-4 inline-flex items-center gap-2 text-bumdes-700 font-semibold text-sm hover:gap-3 transition-all duration-200 group/link"
        >
          Baca Selengkapnya
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
