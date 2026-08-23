# Social Media Content Analyzer 🚀

[![Live Demo](https://img.shields.io/badge/Live_Demo-Social_Media_Content_Analyzer-4f46e5?style=for-the-badge&logo=google-cloud&logoColor=white)](https://ais-pre-nvwpnh5vsntasqqqdaogiv-20065204739.asia-southeast1.run.app)
[![Tech Stack](https://img.shields.io/badge/Built_With-React_19_+_Node.js_+_Gemini_AI-10b981?style=for-the-badge)](https://ais-pre-nvwpnh5vsntasqqqdaogiv-20065204739.asia-southeast1.run.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Type_Safe-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> 🌐 **Live Demo URL**: [**https://social-media-content-analyzer (Live Application)**](https://ais-pre-nvwpnh5vsntasqqqdaogiv-20065204739.asia-southeast1.run.app)

An intelligent, full-stack web application that ingests drafts, PDF documents, and image scans via OCR, evaluates social engagement potential across 6 core performance pillars, simulates audience reach velocity, analyzes counterfactual "What If" scenarios, and generates high-converting AI content rewrites paired with visual social feed graphics.

---

## 📌 Core Features

1. **Document Ingestion & Multi-Format Parsing**:
   - **PDF Document Extraction**: In-browser PDF parsing preserving paragraph structure and layout hierarchy.
   - **Image Optical Character Recognition (OCR)**: Client-side image extraction via Tesseract.js with Multimodal Gemini fallback for complex or low-contrast scans.
   - **Real-Time Word & Character Metrics**: Live character count, word count, and reading time calculation.

2. **Multi-Pillar Engagement Scoring**:
   - **Hook Impact**: Scroll-stopping first impression and curiosity gap analysis.
   - **Clarity & Structure**: Readability, cognitive load, formatting, and pacing.
   - **Emotional Resonance**: Sentiment alignment and authentic audience connection.
   - **Virality & Shareability**: Share catalysts and contrarian or utility triggers.
   - **Audience Fit**: Target demographic tone alignment.
   - **Call-to-Action (CTA)**: Engagement prompt clarity for comments, saves, and shares.

3. **Engagement Forecast Simulation**:
   - Dynamic reach velocity curves across 24-hour timelines.
   - Interactive parameters for **Audience Tier** (Micro, Mid-Tier, Macro), **Post Schedule Window**, and **Media Format**.
   - Projected metrics for Impressions, Likes, Comments, Shares, and Estimated Virality Probability.

4. **Counterfactual "What If" Hypotheses**:
   - Generates 3 alternate structural variations (e.g., *Shorter Punchy Hook*, *Question-Driven CTA*, *Bullet-Point Restructuring*).
   - Expected delta impact on engagement score (+8% to +25%).
   - One-click **Apply Scenario** button to load the optimized version directly into the editor for instant re-testing.

5. **AI Content Rewrite & Social Graphic Generator**:
   - Generates an engagement-optimized rewrite with formatted spacing and hashtags.
   - 1-click clipboard copy button.
   - Dynamic social media feed graphic preview generated via Gemini image synthesis.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend**: Node.js, Express, TSX, esbuild.
- **AI & Multimodal**: Google Gemini API via `@google/genai` (Server-Side Proxy Architecture).
- **OCR & Document Ingestion**: `pdfjs-dist` (PDF text extraction), `tesseract.js` (Image OCR).
- **Build System**: Vite 6.

---

## 🚀 Getting Started (Run Locally)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/social-media-content-analyzer.git
cd social-media-content-analyzer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *(Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 4. Start the Application
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🚢 Production Deployment

To bundle and deploy for production:

```bash
# Build the production assets and server bundle
npm run build

# Start the standalone server
npm start
```

### Deploy to Free Cloud Hosting (Render / Railway / Cloud Run)
1. Push this repository to GitHub.
2. Link the repository to your hosting provider.
3. Configure the build commands:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variable**: `GEMINI_API_KEY=your_gemini_api_key`
4. The service will deploy and provide a 24/7 public URL.

---

## 📄 License

MIT License. Free for personal and commercial use.

