import React from 'react';

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-3 text-lg font-medium text-slate">Loading...</span>
    </div>
  );
} 