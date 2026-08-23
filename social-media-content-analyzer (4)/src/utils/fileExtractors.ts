import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
if (typeof window !== 'undefined') {
  // Use CDN worker matching pdfjs-dist version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ProgressCallback {
  (progress: { status: string; progress: number }): void;
}

/**
 * Extract text from a PDF file using pdfjs-dist
 */
export async function extractTextFromPDF(
  file: File,
  onProgress?: ProgressCallback
): Promise<{ text: string; pageCount: number }> {
  try {
    onProgress?.({ status: 'Loading PDF document...', progress: 10 });
    const arrayBuffer = await file.arrayBuffer();
    
    onProgress?.({ status: 'Parsing document structure...', progress: 30 });
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    
    const numPages = pdfDoc.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      onProgress?.({
        status: `Extracting text from page ${pageNum} of ${numPages}...`,
        progress: 30 + Math.round((pageNum / numPages) * 60),
      });

      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items as any[]) {
        if ('str' in item) {
          // Add newline if vertical position shifted significantly
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 8) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          pageText += item.str;
          lastY = item.transform[5];
        }
      }

      fullText += (pageNum > 1 ? '\n\n' : '') + pageText.trim();
    }

    onProgress?.({ status: 'Extraction complete', progress: 100 });

    return {
      text: fullText.trim(),
      pageCount: numPages,
    };
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    throw new Error(error.message || 'Failed to parse PDF document.');
  }
}

/**
 * Extract text from an image (scanned document) using Tesseract.js OCR
 */
export async function extractTextFromImageOCR(
  file: File | string,
  onProgress?: ProgressCallback
): Promise<{ text: string; confidence: number }> {
  try {
    onProgress?.({ status: 'Initializing Tesseract OCR engine...', progress: 10 });

    const worker = await createWorker('eng');

    onProgress?.({ status: 'Processing image & recognizing text...', progress: 35 });

    const ret = await worker.recognize(file);
    
    onProgress?.({ status: 'Finalizing text formatting...', progress: 95 });
    
    await worker.terminate();

    onProgress?.({ status: 'OCR Extraction complete', progress: 100 });

    return {
      text: ret.data.text.trim(),
      confidence: ret.data.confidence,
    };
  } catch (error: any) {
    console.error('OCR Error:', error);
    throw new Error(error.message || 'Failed to extract text using OCR.');
  }
}

/**
 * Fallback / Multimodal AI Document Extraction using server endpoint
 */
export async function extractTextWithGeminiMultimodal(
  file: File,
  onProgress?: ProgressCallback
): Promise<string> {
  onProgress?.({ status: 'Uploading to AI Multimodal Engine...', progress: 20 });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        onProgress?.({ status: 'AI deep analyzing and transcribing document...', progress: 60 });

        const res = await fetch('/api/extract-multimodal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64Data,
            mimeType: file.type || 'application/octet-stream',
            fileName: file.name,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Server failed to process multimodal file');
        }

        const data = await res.json();
        onProgress?.({ status: 'AI Transcription complete', progress: 100 });
        resolve(data.extractedText);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
