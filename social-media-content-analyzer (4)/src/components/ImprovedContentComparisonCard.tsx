import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  Palette,
  Layers,
  Zap,
} from 'lucide-react';
import { ImprovedContentData, VisualGraphicData } from '../types';

interface ImprovedContentComparisonCardProps {
  originalText: string;
  improvedData: ImprovedContentData;
  originalImageSrc?: string;
  onUseImprovedText: (text: string) => void;
  isRegenerating?: boolean;
  onRegenerate?: () => void;
}

export const ImprovedContentComparisonCard: React.FC<ImprovedContentComparisonCardProps> = ({
  originalText,
  improvedData,
  originalImageSrc,
  onUseImprovedText,
  isRegenerating,
  onRegenerate,
}) => {
  const [activeTab, setActiveTab] = useState<'copy' | 'visual'>('copy');
  const [copied, setCopied] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [theme, setTheme] = useState<'modern_indigo' | 'midnight_obsidian' | 'clean_slate' | 'emerald_pro'>('modern_indigo');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:5'>('1:1');

  const handleCopyImproved = () => {
    navigator.clipboard.writeText(improvedData.improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(originalText);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const { beforeAfterComparison } = improvedData;
  const visual: VisualGraphicData = improvedData.visualGraphic || {
    headline: 'High-Impact Content Framework',
    subheadline: 'Core Principles for Social Media Engagement',
    keyPoints: [
      'Engineered opening hook creates curiosity',
      'Bulleted 3-step actionable execution model',
      'Direct call-to-action triggers reply loop',
    ],
    callToAction: '📌 Save & Repost for your team',
    theme: 'modern_indigo',
    aspectRatio: '1:1',
  };

  const getThemeClasses = (t: typeof theme) => {
    switch (t) {
      case 'midnight_obsidian':
        return 'bg-slate-950 text-white border-slate-800';
      case 'modern_indigo':
        return 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border-indigo-800';
      case 'emerald_pro':
        return 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white border-emerald-800';
      case 'clean_slate':
        return 'bg-slate-900 text-slate-100 border-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              AI Content Rewrite
            </h3>
            <p className="text-xs text-slate-500">
              High-engagement written copy and visual social feed graphic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('copy')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'copy'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Copy Rewrite</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'visual'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-indigo-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Visual Graphic Redesign</span>
            </button>
          </div>

          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Re-Optimize</span>
            </button>
          )}
        </div>
      </div>

      {/* Strategy Summary */}
      <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-indigo-900">
            Applied Strategy: {improvedData.strategyApplied}
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
            +{beforeAfterComparison.improvedScore - beforeAfterComparison.originalScore} Projected Score Lift
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {improvedData.improvementsMade.map((imp, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>{imp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab 1: Written Copy Rewrite */}
      {activeTab === 'copy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Content Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Original Content
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                    Score: {beforeAfterComparison.originalScore}/100
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOriginal}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title="Copy original"
                  >
                    {copiedOriginal ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {originalImageSrc && (
                <div className="mb-2 rounded-lg border border-slate-200 overflow-hidden max-h-36 bg-slate-100 flex items-center justify-center">
                  <img
                    src={originalImageSrc}
                    alt="Original Upload"
                    className="max-h-36 object-contain"
                  />
                </div>
              )}

              <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-wrap min-h-[200px]">
                {originalText}
              </div>
            </div>
          </div>

          {/* Improved Content Box */}
          <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/20 p-4 space-y-3 flex flex-col justify-between ring-1 ring-indigo-100">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Optimized Social Copy
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Score: {beforeAfterComparison.improvedScore}/100
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyImproved}
                    className="p-1 text-indigo-600 hover:text-indigo-800 rounded transition-colors"
                    title="Copy improved copy"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-indigo-200 text-xs text-slate-900 leading-relaxed font-normal whitespace-pre-wrap min-h-[200px]">
                {improvedData.improvedText}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-100">
              <button
                type="button"
                onClick={handleCopyImproved}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                {copied ? 'Copied' : 'Copy Improved Copy'}
              </button>
              <button
                type="button"
                onClick={() => onUseImprovedText(improvedData.improvedText)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                Replace in Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Visual Graphic Redesign for Images & Feeds */}
      {activeTab === 'visual' && (
        <div className="space-y-4">
          {/* Visual Customization Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Theme:</span>
              <div className="flex items-center gap-1.5">
                {(['modern_indigo', 'midnight_obsidian', 'emerald_pro', 'clean_slate'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold capitalize transition-colors ${
                      theme === t
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Ratio:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200">
                {(['1:1', '16:9', '4:5'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspectRatio(r)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      aspectRatio === r
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Comparison: Original Image/Doc vs. Redesigned Graphic */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Original Input Thumbnail / Preview */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Original Input Asset
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                  Before Optimization
                </span>
              </div>

              {originalImageSrc ? (
                <div className="rounded-xl border border-slate-300 overflow-hidden bg-white p-2 flex items-center justify-center min-h-[260px]">
                  <img
                    src={originalImageSrc}
                    alt="Original Upload"
                    className="max-h-72 object-contain rounded"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 min-h-[260px] flex flex-col justify-center space-y-2 text-xs text-slate-600">
                  <p className="font-bold text-slate-800">Original Text Summary:</p>
                  <p className="line-clamp-6 leading-relaxed italic">{originalText}</p>
                </div>
              )}
            </div>

            {/* AI Redesigned Social Graphic Card */}
            <div className="rounded-xl border-2 border-indigo-300 bg-indigo-50/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  AI Redesigned Visual Feed Card
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  High-Contrast Mobile Ready
                </span>
              </div>

              {/* Graphic Card Preview Container */}
              <div
                className={`w-full rounded-2xl border p-6 shadow-md transition-all flex flex-col justify-between min-h-[280px] ${getThemeClasses(
                  theme
                )}`}
              >
                {/* Header of graphic */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                    <Sparkles className="w-3 h-3 text-indigo-300" />
                    <span>Framework Breakdown</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold leading-snug tracking-tight">
                    {visual.headline}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    {visual.subheadline}
                  </p>
                </div>

                {/* Key Points of graphic */}
                <div className="my-4 space-y-2">
                  {visual.keyPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-100"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-tight">{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Footer / CTA of graphic */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-indigo-300">
                    {visual.callToAction}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    High-Engagement Format
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
