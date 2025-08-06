const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-48"></div>
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-32"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            {/* Avatar and title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading