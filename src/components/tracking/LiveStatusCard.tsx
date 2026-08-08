'use client';

import { LiveStatus } from '@/types';
import {
  Gauge,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

interface LiveStatusCardProps {
  status: LiveStatus;
}

function StatBox({
  label,
  value,
  unit,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  accent?: 'primary' | 'success' | 'warning' | 'danger';
}) {
  const accentMap = {
    primary: 'bg-primary-50 text-primary',
    success: 'bg-success-50 text-success',
    warning: 'bg-warning-50 text-warning',
    danger: 'bg-danger-50 text-danger',
  };
  const iconClass = accent ? accentMap[accent] : 'bg-surface text-text-secondary';

  return (
    <div className="card-surface p-4 rounded-2xl">
      <div className="flex items-center gap-2 mb-2">
        <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center', iconClass)}>
          <Icon size={14} />
        </div>
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-text-primary tabular-nums">{value}</span>
        {unit && <span className="text-sm text-text-muted font-medium">{unit}</span>}
      </div>
    </div>
  );
}

export function LiveStatusCard({ status }: LiveStatusCardProps) {
  const delayMinutes = status.delay;
  const isDelayed = delayMinutes > 5;
  const isEarly = delayMinutes < 0;
  const isOnTime = !isDelayed && !isEarly;

  const delayLabel = isEarly
    ? `${Math.abs(delayMinutes)} min early`
    : isOnTime
    ? 'On time'
    : `${delayMinutes} min late`;

  const delayAccent = isEarly ? 'success' : isOnTime ? 'success' : delayMinutes > 30 ? 'danger' : 'warning';

  const eta = status.eta ? new Date(status.eta) : null;

  return (
    <div className="card p-5">
      {/* Status Banner */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-sm font-semibold text-text-primary">Running</span>
        </div>
        <span
          className={clsx(
            'badge',
            isEarly ? 'badge-success' : isOnTime ? 'badge-success' : delayMinutes > 30 ? 'badge-danger' : 'badge-warning'
          )}
        >
          {isEarly || isOnTime ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
          {delayLabel}
        </span>
      </div>

      {/* Route: Current → Next station */}
      <div className="flex items-start gap-3 mb-5">
        <div className="flex flex-col items-center mt-1">
          <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary-200" />
          <div className="w-0.5 h-8 bg-border my-1" />
          <div className="w-3 h-3 rounded-full border-2 border-text-muted" />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <div className="font-semibold text-base text-text-primary leading-tight">
              {status.currentStation.name}
            </div>
            <div className="text-xs text-text-muted">
              {status.currentStation.status === 'current' ? 'Currently at / passing' : 'Departed'} · {status.currentStation.code}
            </div>
          </div>
          <div>
            <div className="font-medium text-sm text-text-secondary leading-tight">
              {status.nextStation.name}
            </div>
            <div className="text-xs text-text-muted">
              Next stop · {status.nextStation.scheduledArrival} · {status.nextStation.code}
            </div>
          </div>
        </div>
        {eta && (
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-text-muted mb-1">Destination ETA</div>
            <div className="text-xl font-bold text-text-primary tabular-nums">{format(eta, 'HH:mm')}</div>
            <div className="text-xs text-text-muted">{format(eta, 'dd MMM')}</div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Speed" value={status.speed} unit="km/h" icon={Gauge} accent="primary" />
        <StatBox
          label="Delay"
          value={isEarly ? `-${Math.abs(delayMinutes)}` : String(delayMinutes)}
          unit="min"
          icon={Clock}
          accent={delayAccent}
        />
        <StatBox label="Covered" value={status.distanceCovered} unit="km" icon={Navigation} />
        <StatBox label="Remaining" value={status.distanceRemaining} unit="km" icon={MapPin} />
      </div>

      {/* Last updated */}
      <div className="mt-3 text-xs text-text-muted text-right">
        Updated {format(new Date(status.lastUpdated), 'HH:mm:ss')}
      </div>
    </div>
  );
}
