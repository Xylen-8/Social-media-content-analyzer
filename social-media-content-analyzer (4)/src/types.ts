export type SocialPlatform = 'general' | 'linkedin' | 'x_twitter' | 'instagram' | 'facebook';

export type PostGoal = 'engagement' | 'virality' | 'conversions' | 'brand_awareness' | 'discussion';

export type ContentTone = 'Professional' | 'Friendly' | 'Educational' | 'Promotional' | 'Emotional' | 'Informative' | 'Casual';

export type SentimentType = 'Positive' | 'Neutral' | 'Negative';

export interface DocumentUpload {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  size: number;
  dataUrl?: string;
  extractedText: string;
  extractionMethod: 'PDF Parser' | 'OCR' | 'AI Multimodal' | 'Manual Input';
  confidenceScore?: number;
  pageCount?: number;
  paragraphCount?: number;
  wordCount?: number;
  charCount?: number;
}

export interface MetricDetail {
  score: number; // 0 - 100
  rating: 'Exceptional' | 'Strong' | 'Average' | 'Needs Work' | 'Critical';
  summary: string;
  whyThisScore: {
    strengths: string[];
    weaknesses: string[];
  };
}

export interface PriorityRecommendation {
  id: string;
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  category: 'Hook' | 'Call to Action' | 'Readability' | 'Engagement' | 'Structure' | 'Tone';
  problem: string;
  whyItMatters: string;
  suggestedImprovement: string;
}

export interface ComparisonMetric {
  metric: string;
  before: number;
  after: number;
  delta: number;
  rationale: string;
}

export interface VisualGraphicData {
  headline: string;
  subheadline: string;
  keyPoints: string[];
  callToAction: string;
  theme: 'modern_indigo' | 'midnight_obsidian' | 'clean_slate' | 'emerald_pro';
  aspectRatio: '1:1' | '16:9' | '4:5';
}

export interface ImprovedContentData {
  improvedText: string;
  strategyApplied: string;
  improvementsMade: string[];
  visualGraphic?: VisualGraphicData;
  beforeAfterComparison: {
    originalScore: number;
    improvedScore: number;
    metrics: ComparisonMetric[];
  };
}

export interface EngagementWeakness {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'optimization';
  category: 'Hook' | 'Lead' | 'CTA' | 'Structure' | 'Virality' | 'Credibility' | 'Visual';
  detectedExcerpt?: string;
  description: string;
  algorithmicImpact: string;
  actionableFix: string;
  fixSnippet?: string;
}

export interface CounterfactualScenario {
  id: string;
  title: string;
  hypothesis: string;
  category: 'Hook' | 'Structure' | 'CTA' | 'Tone' | 'Length';
  projectedDeltas: {
    overallScore: number;
    hookScore: number;
    commentsRate: number;
    saveRate: number;
    shareRate: number;
    readCompletion: number;
  };
  explanation: string;
  modifiedText: string;
}

export interface SimulationMetricRange {
  min: number;
  max: number;
  avg: number;
}

export interface EngagementSimulationData {
  platform: SocialPlatform;
  followerTier: string;
  postingTime: string;
  format: string;
  estimatedReach: SimulationMetricRange;
  estimatedImpressions: SimulationMetricRange;
  estimatedLikes: SimulationMetricRange;
  estimatedComments: SimulationMetricRange;
  estimatedShares: SimulationMetricRange;
  estimatedSaves: SimulationMetricRange;
  ctrPercentage: number;
  viralityMultiplier: number;
  velocityCurve: { timeLabel: string; velocityPercent: number }[];
  percentileRank: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  originalText: string;
  documentMeta?: {
    name: string;
    type: 'pdf' | 'image' | 'text';
    size: number;
    dataUrl?: string;
    extractionMethod: 'PDF Parser' | 'OCR' | 'AI Multimodal' | 'Manual Input';
    confidenceScore?: number;
    pageCount?: number;
    paragraphCount?: number;
  };
  selectedPlatform: SocialPlatform;
  
  // 1. Overall Score & 6 Breakdown Pillars
  overallScore: number; // 0 - 100
  summary: string;
  pillars: {
    hookStrength: MetricDetail;
    readability: MetricDetail;
    ctaStrength: MetricDetail;
    engagementPotential: MetricDetail;
    relevance: MetricDetail;
    contentClarity: MetricDetail;
  };

  // 2. Hook Analyzer
  hookAnalysis: {
    score: number;
    openingText: string;
    createsCuriosity: boolean;
    communicatesValue: boolean;
    emotionalResponse: boolean;
    usesQuestion: boolean;
    encouragesContinuation: boolean;
    explanation: string;
    strengths: string[];
    weaknesses: string[];
    suggestedHooks: string[];
  };

  // 3. CTA Analyzer
  ctaAnalysis: {
    score: number;
    detectedCTA?: string;
    hasClearCTA: boolean;
    actionType: 'Comment' | 'Share' | 'Follow' | 'Visit Link' | 'Learn More' | 'Try Now' | 'Download' | 'None Detected';
    explanation: string;
    strengths: string[];
    weaknesses: string[];
    recommendedCTAs: string[];
  };

  // 4. Engagement Weakness Detector
  weaknesses: EngagementWeakness[];

  // 5. Counterfactual Content Analyzer
  counterfactuals: CounterfactualScenario[];

  // 6. AI Content Rewrite & Comparison (including image/visuals)
  improvedVersion: ImprovedContentData;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  documentName: string;
  extractionMethod: string;
  originalTextSnippet: string;
  overallScore: number;
  selectedPlatform: SocialPlatform;
  analysis: AnalysisResult;
}
