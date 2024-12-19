import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return <Skeleton className="h-32 w-[800px] rounded-sm" />;
};
