import React, { useState } from 'react';
import {
  GitBranch,
  ArrowUpRight,
  Sparkles,
  Zap,
  Check,
  Copy,
  Layers,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Bookmark,
  Share2,
} from 'lucide-react';
import { CounterfactualScenario } from '../types';

interface CounterfactualAnalyzerProps {
  scenarios: CounterfactualScenario[];
  onApplyScenario?: (modifiedText: string) => void;
}

export const CounterfactualAnalyzer: React.FC<CounterfactualAnalyzerProps> = ({
  scenarios,
  onApplyScenario,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    scenarios[0]?.id || ''
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!activeScenario) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Counterfactual Content Analyzer
            </h3>
            <p className="text-xs text-slate-500">
              Simulate “What-if” structural hypotheses and see projected performance shifts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold self-start sm:self-auto">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>{scenarios.length} Counterfactual Hypotheses</span>
        </div>
      </div>

      {/* Scenario Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {scenarios.map((scenario) => {
          const isSelected = scenario.id === activeScenario.id;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setSelectedScenarioId(scenario.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {scenario.category}
              </span>
              <span>{scenario.title.replace('What if we ', '').replace('?', '')}</span>
              <span className="text-emerald-400 font-extrabold text-[11px]">
                +{scenario.projectedDeltas.overallScore} pts
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detailed Breakdown */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
        {/* Hypothesis and Category */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Hypothesis — {activeScenario.category}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 pt-0.5">
              {activeScenario.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {activeScenario.hypothesis}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy(activeScenario.modifiedText, activeScenario.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            >
              {copiedId === activeScenario.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            {onApplyScenario && (
              <button
                type="button"
                onClick={() => onApplyScenario(activeScenario.modifiedText)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Apply Scenario</span>
              </button>
            )}
          </div>
        </div>

        {/* Projected Impact Deltas Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {/* Overall */}
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Overall Score</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-emerald-600">
                +{activeScenario.projectedDeltas.overallScore}
              </span>
              <span className="text-[10px] text-slate-400">pts</span>
            </div>
          </div>

          {/* Hook Score */}
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Hook Retention</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-indigo-600">
                +{activeScenario.projectedDeltas.hookScore}%
              </span>
            </div>
          </div>

          {/* Comments Rate */}
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Comments Rate</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-indigo-600">
                +{activeScenario.projectedDeltas.commentsRate}%
              </span>
            </div>
          </div>

          {/* Save / Bookmark Rate */}
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Save Rate</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-amber-600">
                +{activeScenario.projectedDeltas.saveRate}%
              </span>
            </div>
          </div>

          {/* Share Rate */}
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Share Velocity</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-blue-600">
                +{activeScenario.projectedDeltas.shareRate}%
              </span>
            </div>
          </div>

          {/* Read Completion */}
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Read Completion</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-emerald-600">
                +{activeScenario.projectedDeltas.readCompletion}%
              </span>
            </div>
          </div>
        </div>

        {/* Algorithmic Mechanism Explanation */}
        <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Algorithmic Mechanism: </span>
            {activeScenario.explanation}
          </p>
        </div>

        {/* Counterfactual Text Preview */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-bold text-slate-700 block">
            Counterfactual Modified Content Preview:
          </span>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {activeScenario.modifiedText}
          </div>
        </div>
      </div>
    </div>
  );
};
