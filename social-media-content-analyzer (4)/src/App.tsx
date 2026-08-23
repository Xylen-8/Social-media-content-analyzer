import React, { useState } from 'react';
import { AlertCircle, Sparkles, ArrowUp } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DocumentUploader } from './components/DocumentUploader';
import { ScoreOverviewCard } from './components/ScoreOverviewCard';
import { EngagementSimulation } from './components/EngagementSimulation';
import { CounterfactualAnalyzer } from './components/CounterfactualAnalyzer';
import { ImprovedContentComparisonCard } from './components/ImprovedContentComparisonCard';
import {
  AnalysisResult,
  DocumentUpload,
} from './types';

export default function App() {
  const [text, setText] = useState<string>('');
  const [documentMeta, setDocumentMeta] = useState<DocumentUpload | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isImproving, setIsImproving] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleRunAnalysis = async () => {
    if (!text.trim()) {
      setAnalysisError('Please enter text or upload a document before running analysis.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          selectedPlatform: 'general',
          documentMeta: documentMeta
            ? {
                name: documentMeta.name,
                type: documentMeta.type,
                size: documentMeta.size,
                dataUrl: documentMeta.dataUrl,
                extractionMethod: documentMeta.extractionMethod,
                confidenceScore: documentMeta.confidenceScore,
                pageCount: documentMeta.pageCount,
                paragraphCount: documentMeta.paragraphCount,
              }
            : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server returned an error during analysis.');
      }

      const result: AnalysisResult = await res.json();
      setAnalysisResult(result);

      setTimeout(() => {
        const resultsEl = document.getElementById('analysis-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'An unexpected error occurred during content analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegenerateImprovement = async () => {
    if (!text.trim()) return;
    setIsImproving(true);

    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          selectedPlatform: 'general',
          documentMeta: documentMeta ? { name: documentMeta.name, type: documentMeta.type } : undefined,
        }),
      });

      if (res.ok) {
        const newImproved = await res.json();
        if (analysisResult) {
          setAnalysisResult({
            ...analysisResult,
            improvedVersion: newImproved,
          });
        }
      }
    } catch (err) {
      console.error('Failed to regenerate improvement:', err);
    } finally {
      setIsImproving(false);
    }
  };

  const handleApplyText = (newText: string) => {
    setText(newText);
    const editor = document.getElementById('post-content-textarea');
    if (editor) {
      editor.scrollIntoView({ behavior: 'smooth' });
      editor.focus();
    }
  };

  const handleNewAnalysis = () => {
    setText('');
    setDocumentMeta(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Clean Minimalist Navbar */}
      <Navbar onNewAnalysis={analysisResult ? handleNewAnalysis : undefined} />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Error Banner */}
        {analysisError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Validation / Analysis Notice</p>
              <p>{analysisError}</p>
            </div>
            <button
              type="button"
              onClick={() => setAnalysisError(null)}
              className="text-red-500 hover:text-red-800 font-bold text-sm"
            >
              &times;
            </button>
          </div>
        )}

        {/* Section 1: Upload & Text Input */}
        <section id="uploader-section" className="space-y-3">
          <DocumentUploader
            text={text}
            onChangeText={setText}
            documentMeta={documentMeta}
            onSetDocumentMeta={setDocumentMeta}
            isAnalyzing={isAnalyzing}
            onRunAnalysis={handleRunAnalysis}
          />
        </section>

        {/* Section 2: Results & Full Analytical Breakdown */}
        {analysisResult && (
          <section id="analysis-results-section" className="space-y-8 pt-4">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evaluation Results & Optimization Suite</span>
              </div>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            {/* 1. Overall Score & 6 Breakdown Pillars */}
            <ScoreOverviewCard analysis={analysisResult} />

            {/* 2. Engagement Simulation & Velocity Forecast */}
            <EngagementSimulation analysis={analysisResult} />

            {/* 3. Counterfactual Content Analyzer */}
            <CounterfactualAnalyzer
              scenarios={analysisResult.counterfactuals}
              onApplyScenario={handleApplyText}
            />

            {/* 4. AI Content Rewrite (Text + Visual Graphics) */}
            <ImprovedContentComparisonCard
              originalText={analysisResult.originalText}
              improvedData={analysisResult.improvedVersion}
              originalImageSrc={documentMeta?.dataUrl}
              onUseImprovedText={handleApplyText}
              isRegenerating={isImproving}
              onRegenerate={handleRegenerateImprovement}
            />

            {/* Floating Action / Back to top */}
            <div className="flex justify-center pt-4 pb-8">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top & Edit Draft</span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
