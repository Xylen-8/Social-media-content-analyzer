# Social Media Content Analyzer 🚀

> An intelligent, full-stack web application that extracts text from documents (PDFs and scanned images via OCR), evaluates social media post engagement and viral mechanics, runs simulation forecasts, analyzes counterfactual scenarios, and generates AI-optimized copy and visual social feed graphics.

---

## 📌 Overview

The **Social Media Content Analyzer** is a full-stack React & Node.js application that evaluates content engagement potential using Google's Gemini models.

Key capabilities:
- **Document & Image Ingestion**: Extract copy directly from PDFs (`pdfjs-dist`) or scanned images/graphics via client-side OCR (`tesseract.js`) and Multimodal AI fallback.
- **Engagement Evaluation**: Evaluates 6 key performance pillars: Hook Impact, Clarity & Structure, Emotional Resonance, Virality & Shareability, Audience Fit, and Call-to-Action.
- **Engagement Simulation**: Interactive velocity and engagement forecast modeling based on audience tier, posting window, and format.
- **Counterfactual Hypotheses**: Test "What If" alternate formulations with one-click **Apply Scenario** to iteratively test variations.
- **AI Content Rewrite & Social Graphic Generation**: High-converting copy generation paired with visual social media feed graphic preview.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend**: Node.js, Express, TSX, esbuild.
- **AI Engine**: Google Gemini API via `@google/genai` (Server-Side Proxy).
- **Document & OCR**: `pdfjs-dist` (PDF parsing), `tesseract.js` (OCR).
- **Bundler & Build**: Vite 6.

---

## 🚀 Running Locally

### 1. Clone & Install
```bash
git clone https://github.com/your-username/social-media-content-analyzer.git
cd social-media-content-analyzer
npm install
```

### 2. Configure Environment Variable
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
```bash
npm run build
npm start
```
