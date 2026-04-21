import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div>
        <Skeleton className="h-6 w-36 mb-4 rounded-xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-6 w-44 mb-4 rounded-xl" />
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
