import React, { useState } from 'react';
import { Upload, Link, FileText, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const ProductDescriptionCreator = () => {
  const [urls, setUrls] = useState([]);
  const [manualUrl, setManualUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n');
          const extractedUrls = lines
            .map(line => line.trim())
            .filter(line => line.startsWith('http'));
          setUrls(extractedUrls);
          setError(null);
        } catch (err) {
          setError('Failed to read file. Please ensure it contains valid URLs.');
        }
      };
      reader.readAsText(file);
    }
  };

  const addManualUrl = () => {
    if (manualUrl && manualUrl.startsWith('http')) {
      setUrls([...urls, manualUrl]);
      setManualUrl('');
      setError(null);
    } else {
      setError('Please enter a valid URL starting with http:// or https://');
    }
  };

  const removeUrl = (index) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const generateDescriptions = async () => {
    if (urls.length === 0) {
      setError('Please add at least one URL');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: urls.length });
    const newResults = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      setProgress({ current: i + 1, total: urls.length });

      try {
        // Step 1: Scrape the URL
        const scrapeResponse = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });

        if (!scrapeResponse.ok) {
          throw new Error(`Failed to scrape ${url}`);
        }

        const scrapedData = await scrapeResponse.json();

        // Step 2: Generate content
        const contentResponse = await fetch('/api/generate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            scrapedData
          })
        });

        if (!contentResponse.ok) {
          throw new Error(`Failed to generate content for ${url}`);
        }

        const content = await contentResponse.json();
        newResults.push({
          url,
          ...content,
          success: true
        });

      } catch (err) {
        console.error(`Error processing ${url}:`, err);
        newResults.push({
          url,
          success: false,
          error: err.message
        });
      }
    }

    setResults(newResults);
    setLoading(false);
    setProgress({ current: 0, total: 0 });
  };

  const exportToWord = async () => {
    if (results.length === 0) return;

    try {
      const response = await fetch('/api/export-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results })
      });

      if (!response.ok) {
        throw new Error('Failed to generate Word document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `product-descriptions-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export document: ' + err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* URL Input Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Link className="mr-2" /> Add Product URLs
        </h2>

        <div className="space-y-4">
          {/* Manual URL Input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="Enter product URL (e.g., https://example.com/product)"
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addManualUrl()}
            />
            <button
              onClick={addManualUrl}
              className="btn-primary"
            >
              Add URL
            </button>
          </div>

          {/* File Upload */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 btn-secondary cursor-pointer">
              <Upload className="w-5 h-5" />
              Upload Excel/CSV
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-500">
              Upload a file with URLs (one per line)
            </span>
          </div>
        </div>

        {/* URL List */}
        {urls.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">URLs to Process ({urls.length})</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {urls.map((url, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1">{url}</span>
                  <button
                    onClick={() => removeUrl(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Generate Button */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={generateDescriptions}
          disabled={loading || urls.length === 0}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing {progress.current}/{progress.total}...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generate Product Descriptions
            </>
          )}
        </button>

        {results.length > 0 && (
          <button
            onClick={exportToWord}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export to Word
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {loading && progress.total > 0 && (
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Processing URL {progress.current} of {progress.total}...
          </p>
        </div>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center">
            <CheckCircle className="mr-2 text-green-500" />
            Generated Content ({results.filter(r => r.success).length}/{results.length} successful)
          </h2>

          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg">{result.productTitle || 'Product ' + (index + 1)}</h3>
                {result.success ? (
                  <span className="text-green-600 text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" /> Success
                  </span>
                ) : (
                  <span className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Failed
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 truncate">{result.url}</p>

              {result.success ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Meta Description</h4>
                    <p className="text-sm text-gray-600">{result.metaDescription}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Introduction</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{result.introduction}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">SEO Keywords</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {result.seoKeywords?.primaryKeywords?.slice(0, 5).map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-red-600 text-sm">{result.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionCreator;