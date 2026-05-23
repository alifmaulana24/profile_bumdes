export function NewsCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-video bg-gray-200 rounded-t-2xl" />
      <div className="p-5 space-y-3">
        <div className="flex gap-3">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-28 mt-2" />
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
