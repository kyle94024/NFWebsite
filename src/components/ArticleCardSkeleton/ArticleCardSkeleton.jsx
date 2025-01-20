import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
    return (
        <div className="flex flex-col w-full gap-8">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-[100px]" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-[90%]" />
            </div>
            <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-[250px]" />
                    <Skeleton className="h-6 w-[200px]" />
                </div>
            </div>
        </div>
    );
}
