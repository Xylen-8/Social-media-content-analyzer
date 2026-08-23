import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  BookOpen,
  Send,
  TrendingUp,
  Target,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface ScoreOverviewCardProps {
  analysis: AnalysisResult;
}

export const ScoreOverviewCard: React.FC<ScoreOverviewCardProps> = ({ analysis }) => {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200 ring-emerald-500';
    if (score >= 65) return 'text-indigo-600 bg-indigo-50 border-indigo-200 ring-indigo-500';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200 ring-amber-500';
    return 'text-rose-600 bg-rose-50 border-rose-200 ring-rose-500';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 65) return 'bg-indigo-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const pillarList = [
    {
      key: 'hookStrength',
      label: 'Hook Strength',
      icon: Zap,
      data: analysis.pillars.hookStrength,
      desc: 'First 2 seconds stop-scroll hook power',
    },
    {
      key: 'readability',
      label: 'Readability',
      icon: BookOpen,
      data: analysis.pillars.readability,
      desc: 'Comprehension flow & sentence cadence',
    },
    {
      key: 'ctaStrength',
      label: 'CTA Strength',
      icon: Send,
      data: analysis.pillars.ctaStrength,
      desc: 'Clarity of conversion / comment action prompt',
    },
    {
      key: 'engagementPotential',
      label: 'Engagement Potential',
      icon: TrendingUp,
      data: analysis.pillars.engagementPotential,
      desc: 'Estimated viral reach & distribution velocity',
    },
    {
      key: 'relevance',
      label: 'Relevance',
      icon: Target,
      data: analysis.pillars.relevance,
      desc: 'Topic cohesion & subject authority',
    },
    {
      key: 'contentClarity',
      label: 'Content Clarity',
      icon: CheckCircle2,
      data: analysis.pillars.contentClarity,
      desc: 'Zero-ambiguity takeaway delivery',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      {/* Top Header & Big Score Display */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              AI Content Evaluation
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Overall Content Score
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            {analysis.summary}
          </p>
        </div>

        {/* Master Score Dial Badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-3 rounded-xl shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="text-right">
            <div className="text-xs font-medium text-slate-500">Quality Index</div>
            <div className="text-xs font-bold text-slate-900">
              {analysis.overallScore >= 80 ? 'High Impact' : analysis.overallScore >= 65 ? 'Solid Foundation' : 'Needs Optimization'}
            </div>
          </div>

          <div
            className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center font-bold shadow-xs ${getScoreColor(
              analysis.overallScore
            )}`}
          >
            <span className="text-xl leading-none">{analysis.overallScore}</span>
            <span className="text-[10px] font-medium opacity-70">/ 100</span>
          </div>
        </div>
      </div>

      {/* 6 Core Breakdown Pillars */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            6 Core Breakdown Pillars
          </h3>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Click any pillar to see explainable AI factors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {pillarList.map(({ key, label, icon: Icon, data, desc }) => {
            const isExpanded = expandedPillar === key;
            return (
              <div
                key={key}
                className={`rounded-lg border transition-all ${
                  isExpanded
                    ? 'border-indigo-300 bg-indigo-50/20 ring-1 ring-indigo-200'
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50/80 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedPillar(isExpanded ? null : key)}
                  className="w-full p-3.5 text-left flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                          <Icon className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <span className="text-xs font-semibold text-slate-900">{label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{data.score}/100</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                      {desc}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full ${getProgressBarColor(data.score)} transition-all duration-500 rounded-full`}
                        style={{ width: `${data.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className="font-medium text-slate-600">{data.rating}</span>
                    <span className="text-indigo-600 hover:underline">
                      {isExpanded ? 'Hide Details' : 'View Factors'}
                    </span>
                  </div>
                </button>

                {/* Explainable AI Drilldown */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-200/70 text-xs space-y-2.5 bg-white/70 rounded-b-lg">
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {data.summary}
                    </p>

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Positive Drivers:
                      </div>
                      <ul className="space-y-1 pl-4 text-[11px] text-slate-600 list-disc">
                        {data.whyThisScore.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    {data.whyThisScore.weaknesses.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Areas for Improvement:
                        </div>
                        <ul className="space-y-1 pl-4 text-[11px] text-slate-600 list-disc">
                          {data.whyThisScore.weaknesses.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Heuristics Disclaimer Banner */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          <strong>Explainable AI Notice:</strong> Scores and engagement projections are calculated from semantic clarity, hook curiosity, and social algorithmic heuristics.
        </span>
      </div>
    </div>
  );
};
