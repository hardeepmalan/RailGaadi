import { clsx } from 'clsx';

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

export function SkeletonCard({ className, lines = 3, showAvatar = false }: SkeletonCardProps) {
  return (
    <div className={clsx('card p-5 animate-fade-in', className)}>
      {showAvatar && <div className="skeleton w-12 h-12 rounded-xl mb-4" />}
      <div className="skeleton h-5 w-2/3 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx('skeleton h-3.5 mb-2', i === lines - 1 ? 'w-1/2' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={2} showAvatar />
      ))}
    </div>
  );
}

export function SkeletonText({ className }: { className?: string }) {
  return <div className={clsx('skeleton h-4', className)} />;
}
