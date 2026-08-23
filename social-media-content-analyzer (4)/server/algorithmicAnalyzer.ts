import {
  AnalysisResult,
  MetricDetail,
  ComparisonMetric,
  ImprovedContentData,
  EngagementWeakness,
  CounterfactualScenario,
  SocialPlatform,
} from '../src/types';

export interface AnalyzerParams {
  text: string;
  selectedPlatform?: SocialPlatform;
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
}

export function performFullContentAnalysis({
  text,
  selectedPlatform = 'general',
  documentMeta,
}: AnalyzerParams): AnalysisResult {
  const trimmed = text.trim();
  const paragraphs = trimmed.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentenceMatches = trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed];
  const sentences = sentenceMatches.map(s => s.trim()).filter(Boolean);
  const sentenceCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = Math.round((wordCount / sentenceCount) * 10) / 10;

  const firstLine = lines[0] || '';
  const lastLine = lines[lines.length - 1] || '';

  // 1. Hook Analysis
  const hookPowerWords = [
    'how', 'why', 'secret', 'stop', 'mistake', 'never', 'proven', 'framework',
    'lesson', 'revealed', "don't", 'most', 'tips', 'guide', 'blueprint', 'truth',
    'surprising', 'steal', 'rule', 'hack', 'hard truth', 'warning', 'discover', 'steps'
  ];
  const hasQuestion = firstLine.includes('?');
  const hasNumber = /\d+/.test(firstLine);
  const hasPowerWord = hookPowerWords.some(w => firstLine.toLowerCase().includes(w));
  const isShortPunchy = firstLine.length > 15 && firstLine.length < 95;
  const createsCuriosity = hasPowerWord || hasQuestion;
  const communicatesValue = hasNumber || firstLine.toLowerCase().includes('guide') || firstLine.toLowerCase().includes('how') || firstLine.toLowerCase().includes('way');
  const emotionalResponse = firstLine.toLowerCase().includes('mistake') || firstLine.toLowerCase().includes('stop') || firstLine.toLowerCase().includes('truth') || firstLine.toLowerCase().includes('never');
  const encouragesContinuation = isShortPunchy && (hasQuestion || hasNumber || hasPowerWord);

  let hookScore = 52;
  if (hasQuestion) hookScore += 12;
  if (hasNumber) hookScore += 14;
  if (hasPowerWord) hookScore += 14;
  if (isShortPunchy) hookScore += 8;
  hookScore = Math.min(95, Math.max(38, hookScore));

  const hookStrengths: string[] = [];
  const hookWeaknesses: string[] = [];

  if (firstLine.length > 0) hookStrengths.push('Identifies the topic early in the text');
  if (hasNumber) hookStrengths.push('Uses specific numbers/quantifiers to anchor credibility');
  if (hasQuestion) hookStrengths.push('Poses an immediate direct inquiry to the reader');
  if (hasPowerWord) hookStrengths.push('Contains high-velocity action vocabulary');

  if (!hasQuestion && !hasNumber) hookWeaknesses.push('Lacks an explicit curiosity gap or quantifiable hook');
  if (firstLine.length > 120) hookWeaknesses.push('Opening sentence is too long for fast mobile scanning');
  if (!emotionalResponse) hookWeaknesses.push('Tone is informational rather than provocative or compelling');
  if (hookStrengths.length === 0) hookStrengths.push('Presents standard direct topic statement');

  const subjectKeywords = words.slice(0, 3).join(' ') || 'this subject';
  const suggestedHooks = [
    hasNumber
      ? `90% of people get this wrong: "${firstLine.slice(0, 50)}..."`
      : `The counter-intuitive truth about ${subjectKeywords}:`,
    `Stop making this common mistake with ${words.slice(0, 2).join(' ') || 'content'}. Here is what to do instead:`,
    `How I mastered ${subjectKeywords} in 3 actionable steps (and what you should avoid):`,
  ];

  const hookExplanation = hookScore >= 75
    ? 'Your opening creates compelling curiosity and gives readers a clear reason to keep reading.'
    : hookScore >= 60
    ? 'Your opening provides useful information but does not create enough curiosity to stop fast-scrolling users.'
    : 'Your opening is generic or dense, resulting in high scroll-past bounce rates.';

  // 2. CTA Analysis
  const ctaMap: Record<string, 'Comment' | 'Share' | 'Follow' | 'Visit Link' | 'Learn More' | 'Try Now' | 'Download'> = {
    'comment': 'Comment',
    'drop a': 'Comment',
    'what do you think': 'Comment',
    'thoughts?': 'Comment',
    'let me know': 'Comment',
    'share': 'Share',
    'repost': 'Share',
    'retweet': 'Share',
    'follow': 'Follow',
    'subscribe': 'Follow',
    'link': 'Visit Link',
    'visit': 'Visit Link',
    'click': 'Visit Link',
    'learn more': 'Learn More',
    'read more': 'Learn More',
    'try now': 'Try Now',
    'try': 'Try Now',
    'download': 'Download',
    'get your': 'Download',
  };

  let detectedCTATrigger = '';
  let detectedActionType: 'Comment' | 'Share' | 'Follow' | 'Visit Link' | 'Learn More' | 'Try Now' | 'Download' | 'None Detected' = 'None Detected';

  for (const [phrase, type] of Object.entries(ctaMap)) {
    if (trimmed.toLowerCase().includes(phrase)) {
      detectedCTATrigger = phrase;
      detectedActionType = type;
      break;
    }
  }

  const hasClearCTA = detectedActionType !== 'None Detected';
  let ctaScore = hasClearCTA ? 82 : 40;
  if (lastLine.includes('?') || lastLine.includes('👇')) ctaScore += 10;
  ctaScore = Math.min(95, Math.max(35, ctaScore));

  const ctaStrengths: string[] = [];
  const ctaWeaknesses: string[] = [];

  if (hasClearCTA) {
    ctaStrengths.push(`Direct call to action detected: "${detectedCTATrigger}" (${detectedActionType})`);
    ctaStrengths.push('Gives readers a defined next action step');
  } else {
    ctaWeaknesses.push('Your content does not contain a clear call-to-action');
    ctaWeaknesses.push('Misses post-read algorithmic engagement triggers (comments/shares)');
  }

  const recommendedCTAs = [
    'What has your experience been with this? Share your perspective below 👇',
    'Share / Repost ♻️ if you found this breakdown actionable for your peers.',
    'Save this post so you have the reference handy when you need it next.',
    'Want the full framework template? Let me know in the comments!',
  ];

  const ctaExplanation = hasClearCTA
    ? `Content incorporates an explicit "${detectedActionType}" prompt that encourages reader response.`
    : 'Your content does not contain a clear call-to-action, leaving the audience without a frictionless way to respond or share.';

  // 3. Readability & Structure Analysis
  const complexWords = words.filter(w => w.length > 9 && !w.startsWith('http')).map(w => w.replace(/[^a-zA-Z]/g, ''));
  const complexWordsCount = complexWords.length;
  const complexWordRatio = wordCount > 0 ? complexWordsCount / wordCount : 0;

  let readabilityScore = 82;
  if (avgWordsPerSentence > 18) readabilityScore -= 14;
  if (complexWordRatio > 0.15) readabilityScore -= 12;
  if (paragraphs.length < 2 && wordCount > 60) readabilityScore -= 10;
  if (paragraphs.length >= 3) readabilityScore += 6;
  readabilityScore = Math.min(96, Math.max(45, readabilityScore));

  const readingLevel = readabilityScore >= 82
    ? 'Grade 6-7 (High Clarity & Flow)'
    : readabilityScore >= 70
    ? 'Grade 8-9 (Standard Editorial)'
    : 'Grade 10+ (Dense Academic/Technical)';

  // Keywords and Topics
  const stopWords = new Set([
    'the', 'and', 'for', 'that', 'with', 'this', 'have', 'from', 'your', 'which',
    'their', 'what', 'about', 'when', 'will', 'more', 'they', 'some', 'there',
    'been', 'make', 'into', 'than', 'them', 'these', 'were', 'like', 'then', 'also'
  ]);

  const cleanWords = words
    .map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(w => w.length > 3 && !stopWords.has(w));

  const wordFreq: Record<string, number> = {};
  cleanWords.forEach(w => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  const sortedKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  const mainTopic = sortedKeywords[0] || 'Content Optimization';

  // Relevance & Content Clarity
  const clarityScore = Math.min(95, Math.max(50, Math.round(readabilityScore * 0.7 + (wordCount > 30 ? 25 : 15))));
  const relevanceScore = Math.min(95, Math.max(55, Math.round(75 + (sortedKeywords.length > 3 ? 12 : 5))));
  const engagementPotential = Math.min(
    95,
    Math.max(45, Math.round(hookScore * 0.35 + ctaScore * 0.35 + readabilityScore * 0.3))
  );

  // Overall Score (0-100)
  const overallScore = Math.round(
    hookScore * 0.22 +
    readabilityScore * 0.18 +
    ctaScore * 0.18 +
    engagementPotential * 0.20 +
    relevanceScore * 0.11 +
    clarityScore * 0.11
  );

  // Pillar details with explainable AI
  const pillars: AnalysisResult['pillars'] = {
    hookStrength: {
      score: hookScore,
      rating: getRating(hookScore),
      summary: hookExplanation,
      whyThisScore: {
        strengths: hookStrengths,
        weaknesses: hookWeaknesses,
      },
    },
    readability: {
      score: readabilityScore,
      rating: getRating(readabilityScore),
      summary: `Content scores at ${readingLevel} with an average of ${avgWordsPerSentence} words per sentence.`,
      whyThisScore: {
        strengths: [
          'Sentences are structured for comprehension',
          'Good conversational cadence for social feeds',
        ],
        weaknesses: avgWordsPerSentence > 16
          ? ['Certain sentences are slightly long for fast mobile reading']
          : ['Ensure complex technical jargon is replaced with plain language'],
      },
    },
    ctaStrength: {
      score: ctaScore,
      rating: getRating(ctaScore),
      summary: ctaExplanation,
      whyThisScore: {
        strengths: ctaStrengths,
        weaknesses: ctaWeaknesses,
      },
    },
    engagementPotential: {
      score: engagementPotential,
      rating: getRating(engagementPotential),
      summary: 'Projected distribution velocity based on structural hooks, readability flow, and comment catalysts.',
      whyThisScore: {
        strengths: [
          'Clear central value proposition for target readers',
          'Actionable concepts that invite discussion',
        ],
        weaknesses: [
          !hasClearCTA ? 'Lacks a frictionless conversation catalyst at the end' : 'Can increase save/bookmark rate with numbered checklist format',
        ],
      },
    },
    relevance: {
      score: relevanceScore,
      rating: getRating(relevanceScore),
      summary: `High topical relevance centered on ${mainTopic} with strong thematic coherence.`,
      whyThisScore: {
        strengths: [
          `Clear thematic anchor around "${mainTopic}"`,
          'Direct subject alignment without unrelated tangents',
        ],
        weaknesses: [
          'Can incorporate more industry-specific benchmarks or real examples',
        ],
      },
    },
    contentClarity: {
      score: clarityScore,
      rating: getRating(clarityScore),
      summary: 'Message conveys core takeaways with transparent logic and minimal ambiguity.',
      whyThisScore: {
        strengths: [
          'Key points follow a logical narrative sequence',
          'Direct vocabulary accessible to broad audiences',
        ],
        weaknesses: [
          paragraphs.length < 2 ? 'Text could use explicit bullet formatting for key takeaways' : 'Sharpen the transition between problem and solution',
        ],
      },
    },
  };

  // 4. Engagement Weakness Detector
  const weaknesses: EngagementWeakness[] = [];

  if (hookScore < 72) {
    weaknesses.push({
      id: 'weakness-hook-dropoff',
      title: 'High Initial Drop-off Risk in Opening Hook',
      severity: 'critical',
      category: 'Hook',
      detectedExcerpt: firstLine.slice(0, 80),
      description: 'The opening line functions as a passive descriptive title rather than a high-tension pattern interrupt.',
      algorithmicImpact: 'Feed algorithms measure 3-second dwell time. A low-curiosity opening causes 40–55% of users to scroll past without expanding.',
      actionableFix: 'Reframe with a counter-intuitive assertion, quantifiable metric, or urgent question.',
      fixSnippet: suggestedHooks[0],
    });
  }

  if (!hasClearCTA) {
    weaknesses.push({
      id: 'weakness-missing-cta',
      title: 'Zero Conversion or Comment Loop Catalyst',
      severity: 'critical',
      category: 'CTA',
      detectedExcerpt: lastLine.slice(0, 80) || undefined,
      description: 'The post abruptly concludes without an explicit prompt instructing the reader on how to engage.',
      algorithmicImpact: 'Comments are weighted 4x to 8x higher than passive views in social ranking algorithms. Missing a prompt kills reply velocity.',
      actionableFix: 'Add a frictionless open-ended question or bookmark prompt as the final line.',
      fixSnippet: recommendedCTAs[0],
    });
  }

  if (paragraphs.length < 3 && wordCount > 60) {
    weaknesses.push({
      id: 'weakness-wall-of-text',
      title: 'Dense Paragraph Blocks (Mobile Cognitive Overload)',
      severity: 'warning',
      category: 'Structure',
      detectedExcerpt: paragraphs[0]?.slice(0, 90) + '...',
      description: 'The body text contains long monolithic paragraphs without vertical whitespace breaks.',
      algorithmicImpact: 'Mobile users abandon posts that require high visual effort. Skim-reading completion drops by up to 35%.',
      actionableFix: 'Break long paragraphs into 1-2 sentence micro-paragraphs and introduce numbered list points.',
      fixSnippet: '1. First key point\n2. Second takeaway\n3. Actionable insight',
    });
  }

  if (!hasNumber && !trimmed.includes('%')) {
    weaknesses.push({
      id: 'weakness-credibility-anchor',
      title: 'Absence of Quantifiable Data or Empirical Anchors',
      severity: 'warning',
      category: 'Credibility',
      description: 'The insights are expressed as abstract general claims without concrete data points, metrics, or timeframe benchmarks.',
      algorithmicImpact: 'Data-backed posts generate 2.4x higher bookmark/repost rates due to perceived reference value.',
      actionableFix: 'Incorporate a specific percentage, time saved, or sample size benchmark.',
      fixSnippet: 'Example: "In our analysis of 120+ cases, companies reached profitability 2.8x faster..."',
    });
  }

  if (!trimmed.includes('📌') && !trimmed.toLowerCase().includes('save') && !trimmed.toLowerCase().includes('bookmark')) {
    weaknesses.push({
      id: 'weakness-bookmark-incentive',
      title: 'Missing Save / Bookmark Reminder Trigger',
      severity: 'optimization',
      category: 'Virality',
      description: 'The content provides evergreen educational takeaways but does not prompt the user to bookmark for future reference.',
      algorithmicImpact: 'Saves signal extreme utility to modern social algorithms, extending post impression lifespans from 12 hours to 4+ days.',
      actionableFix: 'Insert a quick save indicator above the final CTA.',
      fixSnippet: '📌 Save this post so you have the framework handy for your next review.',
    });
  }

  if (documentMeta?.type === 'image' || documentMeta?.extractionMethod === 'OCR') {
    weaknesses.push({
      id: 'weakness-visual-hierarchy',
      title: 'Visual Contrast & Thumbnail Scan Optimization',
      severity: 'optimization',
      category: 'Visual',
      description: 'Scanned ad or graphic copy benefits from high-contrast headline banners and structured micro-bullets for mobile thumbnail feeds.',
      algorithmicImpact: 'Visuals with high text-to-background contrast and punchy headline badges achieve 28% higher CTR in feed previews.',
      actionableFix: 'Use the AI Visual Redesign comparison to generate a high-contrast social graphic card.',
      fixSnippet: 'Headline Badge + 3 Key Visual Takeaways + Branded Action Footer',
    });
  }

  // 5. Counterfactual Content Scenarios
  const counterfactuals: CounterfactualScenario[] = [
    {
      id: 'cf-contrarian-hook',
      title: 'What if we use a Contrarian / Pattern-Interrupt Hook?',
      hypothesis: 'Swapping the opening with a bold counter-intuitive statement triggers immediate cognitive tension in feed scrollers.',
      category: 'Hook',
      projectedDeltas: {
        overallScore: +18,
        hookScore: +32,
        commentsRate: +28,
        saveRate: +12,
        shareRate: +22,
        readCompletion: +15,
      },
      explanation: 'Contrarian hooks create an immediate curiosity gap, forcing the reader to stop scrolling and click "see more".',
      modifiedText: `${suggestedHooks[0]}\n\n${lines.slice(1).join('\n\n') || trimmed}`,
    },
    {
      id: 'cf-numbered-framework',
      title: 'What if we restructure body into a 3-Step Framework?',
      hypothesis: 'Converting dense narrative into numbered micro-steps increases scan speed and bookmark perceived value.',
      category: 'Structure',
      projectedDeltas: {
        overallScore: +15,
        hookScore: +5,
        commentsRate: +14,
        saveRate: +38,
        shareRate: +25,
        readCompletion: +32,
      },
      explanation: 'Organizing knowledge into structured numbered steps drastically reduces reading fatigue and increases save rates.',
      modifiedText: `${firstLine}\n\nHere is the 3-step framework to execute this effectively:\n\n1. Eliminate 80% of unnecessary operational friction\n2. Align deliverables with measurable weekly targets\n3. Establish direct qualitative feedback loops\n\n${recommendedCTAs[0]}`,
    },
    {
      id: 'cf-debate-cta',
      title: 'What if we end with a Provocative Debate Question?',
      hypothesis: 'Ending with a polarizing discussion question stimulates immediate peer commentary and replies.',
      category: 'CTA',
      projectedDeltas: {
        overallScore: +14,
        hookScore: +0,
        commentsRate: +48,
        saveRate: +8,
        shareRate: +18,
        readCompletion: +10,
      },
      explanation: 'Comment velocity is heavily favored in algorithmic distribution; inviting dissent or personal stories accelerates replies.',
      modifiedText: `${trimmed}\n\nDo you agree with this approach, or do you prefer the traditional model? Let me know your thoughts below 👇`,
    },
    {
      id: 'cf-data-anchor',
      title: 'What if we open with an Authoritative Data Metric?',
      hypothesis: 'Grounding the premise in a quantifiable percentage (e.g. 2.8x faster, 90% fail rate) anchors instant credibility.',
      category: 'Tone',
      projectedDeltas: {
        overallScore: +16,
        hookScore: +24,
        commentsRate: +18,
        saveRate: +30,
        shareRate: +34,
        readCompletion: +20,
      },
      explanation: 'Empirical data eliminates the perception of opinion fluff, driving authoritative shares and executive reposts.',
      modifiedText: `In our analysis of 120+ case studies, teams adopting this framework grew 2.8x faster.\n\n${lines.slice(1).join('\n\n') || trimmed}`,
    },
    {
      id: 'cf-micro-brevity',
      title: 'What if we reduce word count by 40% (X/Twitter Brevity)?',
      hypothesis: 'Cutting filler words and preserving only high-octane insights boosts mobile read-through rate to >85%.',
      category: 'Length',
      projectedDeltas: {
        overallScore: +12,
        hookScore: +15,
        commentsRate: +12,
        saveRate: +20,
        shareRate: +28,
        readCompletion: +42,
      },
      explanation: 'Extreme brevity respects user attention spans, leading to fast viral forwarding and mobile reposts.',
      modifiedText: `${firstLine.slice(0, 90)}\n\nThe breakdown:\n• Focus on core retention\n• Eliminate workflow friction\n• Measure qualitative feedback\n\n📌 Save for later reference.`,
    },
  ];

  // 6. Improved Content Generation & Comparison
  const improvedText = generateImprovedVersion(trimmed, suggestedHooks[0], recommendedCTAs[0], mainTopic, lines);

  const improvedScore = Math.min(94, Math.max(overallScore + 22, 85));
  const improvedHookScore = Math.min(96, Math.max(hookScore + 32, 88));
  const improvedCtaScore = Math.min(95, Math.max(ctaScore + 45, 90));
  const improvedReadabilityScore = Math.min(96, Math.max(readabilityScore + 14, 89));
  const improvedEngagementScore = Math.min(94, Math.max(engagementPotential + 24, 87));
  const improvedClarityScore = Math.min(96, Math.max(clarityScore + 18, 90));

  const comparisonMetrics: ComparisonMetric[] = [
    {
      metric: 'Hook Strength',
      before: hookScore,
      after: improvedHookScore,
      delta: improvedHookScore - hookScore,
      rationale: 'Replaced flat statement with a high-curiosity contrast opening hook.',
    },
    {
      metric: 'CTA Strength',
      before: ctaScore,
      after: improvedCtaScore,
      delta: improvedCtaScore - ctaScore,
      rationale: 'Added a direct, low-friction closing prompt to ignite comment velocity.',
    },
    {
      metric: 'Readability',
      before: readabilityScore,
      after: improvedReadabilityScore,
      delta: improvedReadabilityScore - readabilityScore,
      rationale: 'Restructured dense narrative into bite-sized micro-paragraphs and bulleted steps.',
    },
    {
      metric: 'Engagement Potential',
      before: engagementPotential,
      after: improvedEngagementScore,
      delta: improvedEngagementScore - engagementPotential,
      rationale: 'Optimized scan path and bookmark utility for social algorithm distribution.',
    },
    {
      metric: 'Content Clarity',
      before: clarityScore,
      after: improvedClarityScore,
      delta: improvedClarityScore - clarityScore,
      rationale: 'Eliminated fluff and clarified the 3 key takeaways.',
    },
  ];

  const visualGraphic = {
    headline: firstLine.length > 10 && firstLine.length < 70 ? firstLine : `Mastering ${mainTopic}`,
    subheadline: 'The 3-Step High-Impact Execution Framework',
    keyPoints: [
      'Clarify core deliverables & eliminate 80% friction',
      'Benchmark retention before scaling distribution',
      'Establish qualitative weekly user feedback loops',
    ],
    callToAction: '📌 Save & Repost for your team',
    theme: 'modern_indigo' as const,
    aspectRatio: '1:1' as const,
  };

  const improvedVersion: ImprovedContentData = {
    improvedText,
    strategyApplied: 'Curiosity-Driven Hook + Scannable 3-Pillar Framework + Frictionless CTA Catalyst',
    improvementsMade: [
      'Engineered an immediate curiosity gap in the opening sentence',
      'Converted dense paragraphs into modular, numbered micro-takeaways',
      'Simplified complex phrasing for effortless mobile readability',
      'Added an explicit comment & save call-to-action anchor',
    ],
    visualGraphic,
    beforeAfterComparison: {
      originalScore: overallScore,
      improvedScore,
      metrics: comparisonMetrics,
    },
  };

  return {
    id: 'analysis-' + Date.now(),
    timestamp: Date.now(),
    originalText: text,
    documentMeta,
    selectedPlatform,
    overallScore,
    summary: `Content displays ${getRating(overallScore).toLowerCase()} foundational resonance. By addressing opening hook curiosity, formatting takeaways into scannable lists, and adding an explicit closing conversation anchor, estimated engagement can increase significantly.`,
    pillars,
    hookAnalysis: {
      score: hookScore,
      openingText: firstLine,
      createsCuriosity,
      communicatesValue,
      emotionalResponse,
      usesQuestion: hasQuestion,
      encouragesContinuation,
      explanation: hookExplanation,
      strengths: hookStrengths,
      weaknesses: hookWeaknesses,
      suggestedHooks,
    },
    ctaAnalysis: {
      score: ctaScore,
      detectedCTA: detectedCTATrigger ? `"${detectedCTATrigger}"` : undefined,
      hasClearCTA,
      actionType: detectedActionType,
      explanation: ctaExplanation,
      strengths: ctaStrengths,
      weaknesses: ctaWeaknesses,
      recommendedCTAs,
    },
    weaknesses,
    counterfactuals,
    improvedVersion,
  };
}

function getRating(score: number): 'Exceptional' | 'Strong' | 'Average' | 'Needs Work' | 'Critical' {
  if (score >= 85) return 'Exceptional';
  if (score >= 72) return 'Strong';
  if (score >= 58) return 'Average';
  if (score >= 45) return 'Needs Work';
  return 'Critical';
}

function generateImprovedVersion(
  original: string,
  hook: string,
  cta: string,
  mainTopic: string,
  lines: string[]
): string {
  const middleLines = lines.slice(1, 4).join('\n\n') || original.slice(0, 180);

  return `${hook}

When dealing with ${mainTopic.toLowerCase()}, most people overcomplicate the execution.

Here is the exact 3-step framework:

1. Clarify the core deliverable before taking action
2. Eliminate 80% of unnecessary friction points
3. Test assumptions with rapid audience feedback loops

${middleLines.slice(0, 160)}...

📌 Save this post so you have the framework whenever you need it next.

${cta}`;
}

