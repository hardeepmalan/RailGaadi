'use client';

import { Share2, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  trainNumber: string;
  trainName: string;
}

export function ShareButton({ trainNumber, trainName }: ShareButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/track/${trainNumber}`;
    const shareData = {
      title: `Track ${trainName} on RailGaadi`,
      text: `Follow ${trainName} (${trainNumber}) live on RailGaadi!`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="btn btn-ghost p-2 rounded-xl"
      aria-label="Share train journey"
    >
      <Share2 size={18} />
    </button>
  );
}
