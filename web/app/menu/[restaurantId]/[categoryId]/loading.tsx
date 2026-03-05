export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header skeleton */}
      <div
        className="sticky top-0 z-10 bg-white border-b border-[rgba(26,23,20,0.06)] px-4 py-3 flex items-center gap-3"
        style={{ boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
      >
        <div className="w-8 h-8 rounded-full bg-[#EDE9E3] shrink-0 animate-pulse" />
        <div className="flex-1 h-5 w-36 rounded-md bg-[#EDE9E3] animate-pulse" />
        <div className="h-6 w-16 rounded-full bg-[#EDE9E3] animate-pulse shrink-0" />
      </div>

      {/* Search input skeleton */}
      <div className="px-4 py-3">
        <div className="h-11 w-full rounded-[14px] bg-white border border-[rgba(26,23,20,0.06)] animate-pulse" />
      </div>

      {/* Item cards skeleton */}
      <div className="px-4 py-1 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[rgba(26,23,20,0.06)] animate-pulse"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 bg-[#EDE9E3] rounded" />
              <div className="h-3 w-1/2 bg-[#EDE9E3] rounded" />
              <div className="h-3.5 w-16 bg-[#EDE9E3] rounded" />
            </div>
            <div className="w-[30px] h-[30px] rounded-full bg-[#EDE9E3] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
