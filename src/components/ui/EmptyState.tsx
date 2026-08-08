import { Search, Train } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'search' | 'train';
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon = 'search', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4 border border-border">
        {icon === 'search' ? (
          <Search size={28} className="text-text-muted" />
        ) : (
          <Train size={28} className="text-text-muted" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-text-secondary max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
