import React from 'react';

interface NavbarProps {
  onNewAnalysis?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewAnalysis }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 relative flex items-center justify-center">
        <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 text-center">
          Social Media Content Analyzer
        </h1>

        {onNewAnalysis && (
          <button
            type="button"
            onClick={onNewAnalysis}
            className="absolute right-4 sm:right-6 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
          >
            New Draft
          </button>
        )}
      </div>
    </header>
  );
};
