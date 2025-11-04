import React, { useState } from 'react';
import { Upload, Link, FileText, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const ProductDescriptionCreator = () => {
  const [urls, setUrls] = useState([]);
  const [products, setProducts] = useState([]); // New: structured product data with name, category, url
  const [manualUrl, setManualUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // Handle Excel files
      console.log('Processing Excel file...');
      const reader = new FileReader();

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setError('Failed to read the file. Please try again.');
      };

      reader.onload = (e) => {
        try {
          console.log('File loaded, parsing Excel...');
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          console.log('Workbook sheets:', workbook.SheetNames);
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

          // Parse with headers to get objects with column names
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          console.log('Parsed Excel data:', jsonData);
          console.log('Number of rows:', jsonData.length);

          if (jsonData.length === 0) {
            setError('The Excel file appears to be empty. Please check your file.');
            return;
          }

          // Log the first row to see what columns are available
          if (jsonData.length > 0) {
            console.log('First row columns:', Object.keys(jsonData[0]));
          }

          const extractedProducts = [];
          const extractedUrls = [];

          // Process each row as an object with column headers as keys
          jsonData.forEach((row, index) => {
            console.log(`Processing row ${index + 1}:`, row);

            // Support various common column name variations (case-insensitive)
            const getColumnValue = (possibleNames) => {
              for (const name of possibleNames) {
                const value = row[name];
                if (value !== undefined && value !== null) {
                  return String(value).trim();
                }
              }
              return '';
            };

            const productName = getColumnValue(['Product Name', 'ProductName', 'Product', 'Name', 'Title']);
            const category = getColumnValue(['Category', 'Type', 'Product Type', 'ProductType']);
            const url = getColumnValue(['URL', 'Url', 'url', 'Link', 'Website', 'Product URL', 'ProductURL']);

            console.log(`  - Product Name: "${productName}"`);
            console.log(`  - Category: "${category}"`);
            console.log(`  - URL: "${url}"`);
            console.log(`  - URL valid? ${url && url.startsWith('http')}`);

            // Only add if URL exists and starts with http
            if (url && url.startsWith('http')) {
              extractedProducts.push({
                productName: productName || 'Untitled Product',
                category: category || 'General',
                url
              });
              extractedUrls.push(url);
            }
          });

          console.log(`Extracted ${extractedUrls.length} valid URLs from ${jsonData.length} rows`);

          if (extractedProducts.length === 0) {
            setError('No valid URLs found in the Excel file. Please ensure:\n- You have a column header named "URL" (or similar: Link, Website, etc.)\n- URLs start with http:// or https://\n- Optional columns: "Product Name" and "Category"\n\nAvailable columns: ' + (jsonData.length > 0 ? Object.keys(jsonData[0]).join(', ') : 'none'));
          } else {
            console.log('Successfully extracted URLs:', extractedUrls);
            setProducts(extractedProducts);
            setUrls(extractedUrls);
            setError(null);
          }
        } catch (err) {
          console.error('Excel parsing error:', err);
          setError('Failed to read Excel file: ' + err.message + '. Please ensure it is a valid Excel file.');
        }
      };
      reader.readAsArrayBuffer(file);

      // Clear the file input so the same file can be re-uploaded if needed
      event.target.value = '';
    } else if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
        // Handle CSV and text files
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target.result;
            const lines = text.split(/\r?\n/).filter(line => line.trim());

            const extractedProducts = [];
            const extractedUrls = [];

            // Check if first line looks like headers (contains common header keywords)
            const firstLine = lines[0]?.toLowerCase() || '';
            const hasHeaders = /url|link|product|category|name/.test(firstLine);

            if (hasHeaders && lines.length > 1) {
              // Parse CSV with headers
              const headers = lines[0].split(',').map(h => h.trim());
              const urlIndex = headers.findIndex(h =>
                /^(url|link|website|product url)$/i.test(h.trim())
              );
              const nameIndex = headers.findIndex(h =>
                /^(product name|name|title|product)$/i.test(h.trim())
              );
              const categoryIndex = headers.findIndex(h =>
                /^(category|type|product type)$/i.test(h.trim())
              );

              // Process data rows (skip header row)
              for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const url = urlIndex !== -1 ? values[urlIndex] : values[0];

                if (url && url.startsWith('http')) {
                  extractedProducts.push({
                    productName: (nameIndex !== -1 ? values[nameIndex] : '') || 'Untitled Product',
                    category: (categoryIndex !== -1 ? values[categoryIndex] : '') || 'General',
                    url
                  });
                  extractedUrls.push(url);
                }
              }
            } else {
              // Parse as simple URL list (no headers)
              const startIndex = hasHeaders ? 1 : 0;
              for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                // Try to extract URL from line (might be comma-separated)
                const parts = line.split(',').map(p => p.trim());
                const url = parts.find(p => p.startsWith('http')) || parts[0];

                if (url && url.startsWith('http')) {
                  extractedProducts.push({
                    productName: 'Untitled Product',
                    category: 'General',
                    url
                  });
                  extractedUrls.push(url);
                }
              }
            }

            if (extractedUrls.length === 0) {
              setError('No URLs found in the file. Please ensure URLs start with http:// or https://');
            } else {
              setProducts(extractedProducts);
              setUrls(extractedUrls);
              setError(null);
            }
          } catch (err) {
            setError('Failed to read file. Please ensure it contains valid URLs.');
            console.error('CSV parsing error:', err);
          }
        };
        reader.readAsText(file);

      // Clear the file input so the same file can be re-uploaded if needed
      event.target.value = '';
    } else {
      setError('Unsupported file type. Please upload an Excel (.xlsx, .xls), CSV, or text file.');
      event.target.value = '';
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
      const product = products[i] || { productName: '', category: '', url: url };
      setProgress({ current: i + 1, total: urls.length });

      try {
        // Step 1: Enhanced Scraping
        const scrapeResponse = await fetch('/api/scrape-enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            url,
            productName: product.productName,
            category: product.category
          })
        });

        if (!scrapeResponse.ok) {
          // Fallback to basic scraping if enhanced fails
          const fallbackResponse = await fetch('/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url,
              productName: product.productName,
              category: product.category
            })
          });

          if (!fallbackResponse.ok) {
            throw new Error(`Failed to scrape ${url}`);
          }

          const scrapedData = await fallbackResponse.json();
          console.log('Using fallback scraping for:', url);

          // Use basic content generation for fallback
          const contentResponse = await fetch('/api/generate-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url, 
              scrapedData,
              productName: product.productName,
              category: product.category
            })
          });

          if (!contentResponse.ok) {
            throw new Error(`Failed to generate content for ${url}`);
          }

          const content = await contentResponse.json();
          newResults.push({
            url,
            ...content,
            success: true,
            fallbackUsed: true
          });
        } else {
          const scrapedData = await scrapeResponse.json();
          console.log('Enhanced scraping successful for:', url);

          // Step 2: Generate content with business research
          const contentResponse = await fetch('/api/generate-content-v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url,
              scrapedData,
              productName: product.productName,
              category: product.category
            })
          });

          if (!contentResponse.ok) {
            // Fallback to original content generation
            const fallbackContentResponse = await fetch('/api/generate-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                url, 
              scrapedData,
              productName: product.productName,
              category: product.category
            })
          });

            if (!fallbackContentResponse.ok) {
              throw new Error(`Failed to generate content for ${url}`);
            }

            const content = await fallbackContentResponse.json();
            newResults.push({
              url,
              ...content,
              success: true,
              fallbackUsed: true
            });
          } else {
            const content = await contentResponse.json();
            newResults.push({
              url,
              ...content,
              success: true,
              enhancedGeneration: true
            });
          }
        }

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
                <div className="flex items-center gap-2">
                  {result.enhancedGeneration && (
                    <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded">
                      Enhanced AI
                    </span>
                  )}
                  {result.fallbackUsed && (
                    <span className="text-yellow-600 text-xs bg-yellow-100 px-2 py-1 rounded">
                      Basic Mode
                    </span>
                  )}
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
                  {result.featuresAndBenefits && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">Features & Benefits</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {result.featuresAndBenefits.slice(0, 3).map((feature, i) => (
                          <li key={i} className="line-clamp-1">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.technicalSpecs && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">Technical Specifications</h4>
                      <div className="text-sm text-gray-600">
                        {Object.entries(result.technicalSpecs).slice(0, 3).map(([key, value], i) => (
                          <div key={i}>{key}: {value}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.useCases && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700">Use Cases</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {result.useCases.slice(0, 2).map((useCase, i) => (
                          <li key={i} className="line-clamp-1">{useCase}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Call to Action</h4>
                    <p className="text-sm text-gray-600">{result.callToActions}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700">Structured Data (Schema.org)</h4>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.structuredData, null, 2).substring(0, 500)}...
                    </pre>
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