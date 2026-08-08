'use client';

import { Train as TrainIcon, ArrowRight, Clock, Navigation } from 'lucide-react';
import { Train } from '@/types';
import { TRAIN_TYPE_LABELS, TRAIN_TYPE_COLORS } from '@/data/trains';
import { SkeletonList } from '@/components/ui/SkeletonCard';
import { clsx } from 'clsx';

interface SearchResultsProps {
  results: Train[];
  query: string;
  isLoading: boolean;
  onSelect: (trainNumber: string) => void;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-blue-100 text-blue-800 rounded font-bold px-1">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchResults({ results, query, isLoading, onSelect }: SearchResultsProps) {
  return (
    <div
      id="search-results-list"
      role="listbox"
      aria-label="Search results"
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-slide-down"
      style={{ maxHeight: '420px', overflowY: 'auto' }}
    >
      {isLoading ? (
        <div className="p-4">
          <SkeletonList count={3} />
        </div>
      ) : results.length === 0 ? (
        <div className="py-8 px-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <TrainIcon size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Track Any Train #{query}</h4>
          <p className="text-xs text-slate-500">
            Press enter or click below to launch live status tracking for train <strong>#{query}</strong>.
          </p>
          <button
            onClick={() => onSelect(query)}
            className="btn btn-primary text-xs py-2 px-4 rounded-xl mt-2 w-full"
          >
            Track Live Status for Train #{query}
          </button>
        </div>
      ) : (
        <div className="p-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Matching Indian Railways Trains ({results.length})
          </div>
          <ul className="space-y-1">
            {results.map((train) => (
              <li key={train.number}>
                <button
                  role="option"
                  aria-selected="false"
                  onClick={() => onSelect(train.number)}
                  className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shadow-sm">
                    <TrainIcon size={18} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 leading-snug">
                        {highlight(train.name, query)}
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        #{highlight(train.number, query)}
                      </span>
                      <span className={clsx('badge text-[10px] font-semibold', TRAIN_TYPE_COLORS[train.type])}>
                        {TRAIN_TYPE_LABELS[train.type] || train.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="font-semibold text-slate-700">{train.from} ({train.fromCode})</span>
                      <ArrowRight size={12} className="text-slate-400" />
                      <span className="font-semibold text-slate-700">{train.to} ({train.toCode})</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {train.departureTime}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Navigation size={11} /> {train.distance} km</span>
                    </div>
                  </div>

                  {/* Track CTA Arrow */}
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <span>Track</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
