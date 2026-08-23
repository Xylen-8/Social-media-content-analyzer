import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Trash2,
  Check,
  Eye,
  FileCode,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { extractTextFromPDF, extractTextFromImageOCR } from '../utils/fileExtractors';
import { DocumentUpload, SocialPlatform } from '../types';

interface DocumentUploaderProps {
  text: string;
  onChangeText: (newText: string) => void;
  documentMeta: DocumentUpload | null;
  onSetDocumentMeta: (doc: DocumentUpload | null) => void;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  text,
  onChangeText,
  documentMeta,
  onSetDocumentMeta,
  isAnalyzing,
  onRunAnalysis,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'preview'>('text');
  const [extractionProgress, setExtractionProgress] = useState<{ status: string; progress: number }>({
    status: '',
    progress: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);

    // Max 15MB size validation
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage('File size exceeds 15MB limit. Please upload a smaller PDF or image file.');
      return;
    }

    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp)$/i.test(file.name);

    if (!isPDF && !isImage) {
      setErrorMessage('Unsupported file type. Please upload a PDF, JPG, JPEG, or PNG file.');
      return;
    }

    setIsExtracting(true);
    setExtractionProgress({ status: 'Reading file buffer...', progress: 10 });

    try {
      let extracted = '';
      let method: DocumentUpload['extractionMethod'] = 'Manual Input';
      let pageCount: number | undefined;
      let confidenceScore: number | undefined;
      let dataUrl: string | undefined;

      if (isImage) {
        dataUrl = URL.createObjectURL(file);
        setExtractionProgress({ status: 'Running Tesseract OCR engine...', progress: 30 });
        const result = await extractTextFromImageOCR(file, (p) => setExtractionProgress(p));
        extracted = result.text;
        confidenceScore = Math.round(result.confidence || 88);
        method = 'OCR';
      } else {
        setExtractionProgress({ status: 'Parsing PDF document streams...', progress: 30 });
        const result = await extractTextFromPDF(file, (p) => setExtractionProgress(p));
        extracted = result.text;
        pageCount = result.pageCount;
        confidenceScore = 96;
        method = 'PDF Parser';
      }

      if (!extracted || extracted.trim().length === 0) {
        throw new Error('No readable text could be extracted from this file. The document might be blank or password-protected.');
      }

      const paragraphs = extracted.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
      const words = extracted.split(/\s+/).filter(Boolean).length;

      onChangeText(extracted);
      onSetDocumentMeta({
        id: 'doc-' + Date.now(),
        name: file.name,
        type: isPDF ? 'pdf' : 'image',
        size: file.size,
        dataUrl,
        extractedText: extracted,
        extractionMethod: method,
        pageCount,
        confidenceScore,
        paragraphCount: paragraphs,
        wordCount: words,
        charCount: extracted.length,
      });
      setActiveTab('text');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to extract text from the uploaded document.');
    } finally {
      setIsExtracting(false);
      setExtractionProgress({ status: '', progress: 0 });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isAnalyzing || isExtracting) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleCopyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearAll = () => {
    onChangeText('');
    onSetDocumentMeta(null);
    setErrorMessage(null);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;
  const paragraphCount = text.trim() ? text.trim().split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Top Controls: Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <span>Upload or Paste Content</span>
            <span className="text-[11px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              PDF & OCR Ready
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload social graphics, presentation PDFs, or paste your draft copy.
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        id="document-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isExtracting && !isAnalyzing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200'
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
        } ${isExtracting ? 'opacity-85 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*,.png,.jpg,.jpeg,.webp"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isExtracting || isAnalyzing}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            {isExtracting ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {isExtracting ? (
                <span>Extracting Text via {documentMeta?.type === 'pdf' ? 'PDF Parser' : 'OCR'}...</span>
              ) : (
                <>
                  <span className="text-indigo-600 hover:underline">Click to browse file</span> or drag and drop here
                </>
              )}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Supports PDF documents, JPG, JPEG, PNG, WEBP (Max 15MB)
            </p>
          </div>
        </div>

        {/* Extraction Progress Bar */}
        {isExtracting && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-medium flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                {extractionProgress.status}
              </span>
              <span className="font-semibold text-indigo-600">{extractionProgress.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${extractionProgress.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold">Upload Validation Notice</p>
            <p>{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Active Document Metadata Bar */}
      {documentMeta && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              {documentMeta.type === 'pdf' ? (
                <FileText className="w-4 h-4" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 truncate block">
                {documentMeta.name}
              </span>
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <span>{(documentMeta.size / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span className="font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                  {documentMeta.extractionMethod}
                </span>
                {documentMeta.confidenceScore && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">
                      {documentMeta.confidenceScore}% Quality
                    </span>
                  </>
                )}
                {documentMeta.pageCount && (
                  <>
                    <span>•</span>
                    <span>{documentMeta.pageCount} page(s)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {documentMeta.dataUrl && (
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`px-2 py-1 text-[11px] font-medium rounded ${
                    activeTab === 'text'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCode className="w-3 h-3 inline mr-1" />
                  Extracted Text
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-2 py-1 text-[11px] font-medium rounded ${
                    activeTab === 'preview'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  Preview
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded transition-colors"
              title="Replace file"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-slate-200 rounded transition-colors"
              title="Remove document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Image Preview / Extracted Text View */}
      {documentMeta?.dataUrl && activeTab === 'preview' ? (
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-900/5 flex flex-col items-center justify-center">
          <img
            src={documentMeta.dataUrl}
            alt="Uploaded preview"
            className="max-h-64 object-contain rounded border border-slate-200 shadow-sm"
          />
          <p className="text-[11px] text-slate-500 mt-2">Document image loaded for OCR parsing</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="post-content-textarea" className="font-semibold text-slate-700">
              Extracted Content / Post Draft
            </label>
            <div className="flex items-center gap-2.5 text-slate-500 text-[11px]">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} chars</span>
              <span>•</span>
              <span>{paragraphCount} para</span>
              {text && (
                <>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <span>Copy</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-slate-400 hover:text-red-600 font-medium transition-colors"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          <textarea
            id="post-content-textarea"
            rows={7}
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            disabled={isAnalyzing}
            placeholder="Upload a PDF or Image above to extract text, or type/paste your social media post draft directly here..."
            className="w-full p-3.5 text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400 leading-relaxed resize-y font-normal"
          />
        </div>
      )}

      {/* Action Trigger */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
        <button
          id="analyze-content-button"
          type="button"
          onClick={onRunAnalysis}
          disabled={!text.trim() || isAnalyzing || isExtracting}
          className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow transition-all ${
            !text.trim() || isAnalyzing || isExtracting
              ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] hover:shadow-indigo-200'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Analyze</span>
          )}
        </button>
      </div>
    </div>
  );
};
