import { Skeleton } from "@/components/ui/skeleton"

export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="px-4 py-3 border-b">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="px-4 py-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
