export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header skeleton */}
      <div
        className="sticky top-0 z-10 bg-white border-b border-[rgba(26,23,20,0.06)]"
        style={{ boxShadow: "0 1px 4px rgba(26,23,20,0.06)" }}
      >
        {/* Row 1: restaurant name + status pill + table badge */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#EDE9E3] animate-pulse shrink-0" />
            <div className="h-5 w-40 rounded-md bg-[#EDE9E3] animate-pulse" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-6 w-16 rounded-full bg-[#EDE9E3] animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-[#EDE9E3] animate-pulse" />
          </div>
        </div>
        {/* Row 2: waiter call row */}
        <div className="px-4 pb-4">
          <div className="h-[60px] w-full rounded-[20px] bg-[#EDE9E3] animate-pulse" />
        </div>
      </div>

      {/* Search input skeleton */}
      <div className="px-4 py-3">
        <div className="h-11 w-full rounded-[14px] bg-white border border-[rgba(26,23,20,0.06)] animate-pulse" />
      </div>

      {/* Section label skeleton */}
      <div className="px-5 pb-3">
        <div className="h-3 w-24 rounded bg-[#EDE9E3] animate-pulse" />
      </div>

      {/* Category cards skeleton */}
      <div className="px-4 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[rgba(26,23,20,0.06)] animate-pulse"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="w-10 h-10 rounded-[10px] bg-[#EDE9E3] shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-1/2 bg-[#EDE9E3] rounded" />
              <div className="h-3 w-1/3 bg-[#EDE9E3] rounded" />
            </div>
            <div className="w-4 h-4 rounded bg-[#EDE9E3] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
