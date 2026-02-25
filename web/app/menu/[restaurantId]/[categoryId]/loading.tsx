import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="px-4 py-3 border-b">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="px-4 py-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
