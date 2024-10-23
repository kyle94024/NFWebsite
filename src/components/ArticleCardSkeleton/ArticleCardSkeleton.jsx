import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
    return (
        <div className="flex flex-col w-full space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );
}
