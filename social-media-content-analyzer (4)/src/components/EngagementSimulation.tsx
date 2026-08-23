import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Share2,
  Bookmark,
  MessageSquare,
  Heart,
  Eye,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { AnalysisResult, SocialPlatform } from '../types';

interface EngagementSimulationProps {
  analysis: AnalysisResult;
}

type FollowerTier = 'emerging' | 'growth' | 'established' | 'authority';
type PostingTime = 'morning' | 'lunch' | 'afternoon' | 'evening';
type MediaFormat = 'text_only' | 'text_image' | 'carousel';

export const EngagementSimulation: React.FC<EngagementSimulationProps> = ({
  analysis,
}) => {
  const [platform, setPlatform] = useState<SocialPlatform>(analysis.selectedPlatform || 'linkedin');
  const [followerTier, setFollowerTier] = useState<FollowerTier>('growth');
  const [postingTime, setPostingTime] = useState<PostingTime>('morning');
  const [mediaFormat, setMediaFormat] = useState<MediaFormat>(
    analysis.documentMeta?.type === 'image' ? 'text_image' : 'text_image'
  );

  // Compute realistic simulation projections based on user content scores + chosen parameters
  const simulation = useMemo(() => {
    const overall = analysis.overallScore;
    const hook = analysis.pillars.hookStrength.score;
    const cta = analysis.pillars.ctaStrength.score;
    const readability = analysis.pillars.readability.score;

    // Base follower audience
    let baseAudience = 10000;
    if (followerTier === 'emerging') baseAudience = 2500;
    if (followerTier === 'growth') baseAudience = 12000;
    if (followerTier === 'established') baseAudience = 45000;
    if (followerTier === 'authority') baseAudience = 180000;

    // Platform distribution factor
    let platformMultiplier = 1.0;
    if (platform === 'linkedin') platformMultiplier = 1.25;
    if (platform === 'x_twitter') platformMultiplier = 0.95;
    if (platform === 'instagram') platformMultiplier = 1.15;
    if (platform === 'facebook') platformMultiplier = 0.85;

    // Time of day multiplier
    let timeMultiplier = 1.0;
    if (postingTime === 'morning') timeMultiplier = 1.22;
    if (postingTime === 'lunch') timeMultiplier = 1.10;
    if (postingTime === 'afternoon') timeMultiplier = 0.92;
    if (postingTime === 'evening') timeMultiplier = 1.18;

    // Media format multiplier
    let mediaMultiplier = 1.0;
    if (mediaFormat === 'text_only') mediaMultiplier = 0.88;
    if (mediaFormat === 'text_image') mediaMultiplier = 1.35;
    if (mediaFormat === 'carousel') mediaMultiplier = 1.65;

    // Score effectiveness multiplier (60 score is baseline 1.0, 95 is 2.2x)
    const scoreFactor = Math.max(0.4, (overall / 70) * (hook / 70));

    const estImpressionsAvg = Math.round(
      baseAudience * 0.45 * platformMultiplier * timeMultiplier * mediaMultiplier * scoreFactor
    );
    const estImpressionsMin = Math.round(estImpressionsAvg * 0.72);
    const estImpressionsMax = Math.round(estImpressionsAvg * 1.45);

    const estReachAvg = Math.round(estImpressionsAvg * 0.78);

    // Likes & Reactions (~3% - 7% of reach based on readability & overall)
    const likeRate = (0.025 + (overall / 100) * 0.045) * (mediaFormat !== 'text_only' ? 1.2 : 1.0);
    const estLikesAvg = Math.round(estReachAvg * likeRate);

    // Comments (~0.4% - 2.2% of reach heavily driven by CTA & Hook)
    const commentRate = (0.003 + (cta / 100) * 0.018);
    const estCommentsAvg = Math.round(estReachAvg * commentRate);

    // Shares / Reposts
    const shareRate = (0.002 + (hook / 100) * 0.014) * (overall > 80 ? 1.3 : 1.0);
    const estSharesAvg = Math.round(estReachAvg * shareRate);

    // Saves / Bookmarks
    const saveRate = (0.004 + (readability / 100) * 0.022);
    const estSavesAvg = Math.round(estReachAvg * saveRate);

    // Click-Through Rate (CTR)
    const ctrPercentage = Math.round((1.8 + (cta / 100) * 3.4) * 10) / 10;

    // Virality Multiplier
    const viralityMultiplier = Math.round((0.85 + (overall / 100) * 0.95 + (cta > 75 ? 0.3 : 0)) * 100) / 100;

    // 24-hour hourly velocity curve data
    const velocityCurve = [
      { label: '0h (Launch)', pct: 15 },
      { label: '1h (Peak 1)', pct: 85 },
      { label: '2h (Sustained)', pct: 95 },
      { label: '4h (Algorithm Expansion)', pct: 78 },
      { label: '8h (Midday Resurge)', pct: 60 },
      { label: '12h (Evening Wave)', pct: 72 },
      { label: '18h (Decay)', pct: 35 },
      { label: '24h (Long-tail)', pct: 20 },
    ];

    // Percentile rank
    const percentileRank = Math.min(99, Math.max(35, Math.round(overall * 0.92 + (cta > 75 ? 8 : 0))));

    return {
      impressions: { min: estImpressionsMin, max: estImpressionsMax, avg: estImpressionsAvg },
      reach: estReachAvg,
      likes: estLikesAvg,
      comments: estCommentsAvg,
      shares: estSharesAvg,
      saves: estSavesAvg,
      ctrPercentage,
      viralityMultiplier,
      velocityCurve,
      percentileRank,
    };
  }, [analysis, platform, followerTier, postingTime, mediaFormat]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Engagement Simulation & Algorithmic Forecasting
            </h3>
            <p className="text-xs text-slate-500">
              Projected feed distribution, comment velocity, and audience conversion metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Top {100 - simulation.percentileRank}% Feed Distribution Bracket</span>
        </div>
      </div>

      {/* Simulator Interactive Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        {/* Follower Audience Tier */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Audience Follower Tier
          </label>
          <select
            value={followerTier}
            onChange={(e) => setFollowerTier(e.target.value as FollowerTier)}
            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="emerging">Emerging (1K – 5K followers)</option>
            <option value="growth">Growth Tier (5K – 25K followers)</option>
            <option value="established">Established (25K – 100K followers)</option>
            <option value="authority">Authority Network (100K+ followers)</option>
          </select>
        </div>

        {/* Posting Time Window */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Posting Time Window
          </label>
          <select
            value={postingTime}
            onChange={(e) => setPostingTime(e.target.value as PostingTime)}
            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="morning">Morning Peak (7:30 – 9:30 AM)</option>
            <option value="lunch">Lunch Break Scan (12:00 – 1:30 PM)</option>
            <option value="afternoon">Afternoon (3:30 – 5:00 PM)</option>
            <option value="evening">Evening Prime (7:30 – 9:30 PM)</option>
          </select>
        </div>

        {/* Media Asset Format */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Content Presentation Format
          </label>
          <select
            value={mediaFormat}
            onChange={(e) => setMediaFormat(e.target.value as MediaFormat)}
            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="text_image">Text + Graphic Format</option>
            <option value="text_only">Single Text Post</option>
            <option value="carousel">Multi-Slide Format</option>
          </select>
        </div>
      </div>

      {/* Projected Core Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Estimated Impressions */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Impressions</span>
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900">
            {simulation.impressions.avg.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500">
            Range: {simulation.impressions.min.toLocaleString()} – {simulation.impressions.max.toLocaleString()}
          </p>
        </div>

        {/* Estimated Likes */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Reactions</span>
            <Heart className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900">
            {simulation.likes.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">
            ~{Math.round((simulation.likes / simulation.reach) * 1000) / 10}% reaction rate
          </p>
        </div>

        {/* Comments */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Comments</span>
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900">
            {simulation.comments.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500">
            High algorithm weight
          </p>
        </div>

        {/* Shares / Reposts */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Reposts</span>
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900">
            {simulation.shares.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500">
            Viral distribution catalyst
          </p>
        </div>

        {/* Saves / Bookmarks */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Saves</span>
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900">
            {simulation.saves.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">
            Extends feed lifespan
          </p>
        </div>

        {/* Virality Multiplier */}
        <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">Viral Index</span>
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-indigo-950">
            {simulation.viralityMultiplier}x
          </p>
          <p className="text-[10px] text-indigo-700 font-semibold">
            {simulation.ctrPercentage}% Projected CTR
          </p>
        </div>
      </div>

      {/* 24-Hour Hourly Engagement Velocity Curve Chart */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              24-Hour Algorithmic Velocity Curve
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            First 2-hour window determines 70% of total feed reach
          </span>
        </div>

        {/* Bar chart representation */}
        <div className="grid grid-cols-8 gap-2 pt-2">
          {simulation.velocityCurve.map((point, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div className="w-full bg-slate-200 h-24 rounded-lg flex items-end p-1 overflow-hidden">
                <div
                  style={{ height: `${point.pct}%` }}
                  className={`w-full rounded-md transition-all duration-500 ${
                    idx === 1 || idx === 2
                      ? 'bg-indigo-600'
                      : idx === 5
                      ? 'bg-indigo-400'
                      : 'bg-slate-400'
                  }`}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
                {point.pct}%
              </span>
              <span className="text-[9px] text-slate-400 text-center truncate max-w-full">
                {point.label.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
