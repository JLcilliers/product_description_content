import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, productName, category } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch the page content with better headers
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 15000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);

    // Remove script and style elements for cleaner text extraction
    $('script').remove();
    $('style').remove();
    $('noscript').remove();

    // Enhanced data extraction
    const extractedData = {
      url: url,
      domain: new URL(url).hostname,

      // Title extraction - more comprehensive
      title: $('h1').first().text().trim() ||
             $('[class*="product-title"]').first().text().trim() ||
             $('[class*="product-name"]').first().text().trim() ||
             $('[itemprop="name"]').first().text().trim() ||
             $('title').text().split('|')[0].trim() ||
             $('meta[property="og:title"]').attr('content') ||
             'Product',

      // Description extraction - more sources
      description: $('meta[name="description"]').attr('content') ||
                  $('meta[property="og:description"]').attr('content') ||
                  $('.product-description').text().trim() ||
                  $('[class*="description"]').first().text().trim() ||
                  $('[itemprop="description"]').text().trim() ||
                  '',

      // Price extraction - comprehensive patterns
      price: $('.price').first().text().trim() ||
             $('[itemprop="price"]').attr('content') ||
             $('[class*="price"]:contains("£")').first().text().trim() ||
             $('[class*="price"]:contains("$")').first().text().trim() ||
             $('[data-price]').attr('data-price') ||
             '',

      currency: $('[itemprop="priceCurrency"]').attr('content') || 'GBP',

      // Images - better extraction
      images: [],

      // Features - more comprehensive
      features: [],

      // Specifications - enhanced
      specifications: {},

      // Additional important content
      additionalContent: [],

      // Business intelligence data
      businessInfo: {
        companyName: '',
        industry: '',
        certifications: [],
        brandPromises: []
      },

      // SEO data
      seoData: {
        metaTitle: $('title').text().trim(),
        metaDescription: $('meta[name="description"]').attr('content') || '',
        metaKeywords: $('meta[name="keywords"]').attr('content') || '',
        h1: [],
        h2: [],
        h3: []
      },

      // Product details
      productDetails: {
        sku: $('[itemprop="sku"]').text().trim() || '',
        brand: $('[itemprop="brand"]').text().trim() || '',
        category: $('.breadcrumb li:last-child').text().trim() || '',
        availability: $('[itemprop="availability"]').attr('content') || '',
        condition: $('[itemprop="itemCondition"]').text().trim() || ''
      }
    };

    // Extract all text content for comprehensive analysis
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    extractedData.fullTextContent = bodyText.substring(0, 10000); // First 10k chars

    // Extract images with better logic
    const imageSelectors = [
      'img.product-image',
      'img[itemprop="image"]',
      '.product-images img',
      '.gallery img',
      'img[src*="product"]',
      'img[alt*="product"]'
    ];

    imageSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy-src');
        const alt = $(elem).attr('alt') || '';
        if (src && extractedData.images.length < 10) {
          const fullUrl = src.startsWith('http') ? src : new URL(src, url).href;
          extractedData.images.push({ url: fullUrl, alt: alt });
        }
      });
    });

    // Extract features from various sources
    const featureSelectors = [
      '.features li',
      '.product-features li',
      '.key-features li',
      'ul.benefits li',
      '[class*="feature"] li',
      '[class*="benefit"] li'
    ];

    featureSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.length > 5 && text.length < 300 && !extractedData.features.includes(text)) {
          extractedData.features.push(text);
        }
      });
    });

    // Extract specifications from tables and definition lists
    const specSelectors = [
      'table.specifications tr',
      'table.specs tr',
      '.product-specs tr',
      'dl.specifications',
      '.technical-details tr',
      '[class*="specification"] tr'
    ];

    specSelectors.forEach(selector => {
      if (selector.includes('tr')) {
        $(selector).each((i, elem) => {
          const cells = $(elem).find('td, th');
          if (cells.length >= 2) {
            const key = $(cells[0]).text().trim();
            const value = $(cells[1]).text().trim();
            if (key && value && !key.toLowerCase().includes('specification')) {
              extractedData.specifications[key] = value;
            }
          }
        });
      } else if (selector.includes('dl')) {
        $(selector).find('dt').each((i, elem) => {
          const key = $(elem).text().trim();
          const value = $(elem).next('dd').text().trim();
          if (key && value) {
            extractedData.specifications[key] = value;
          }
        });
      }
    });

    // Extract headings for SEO analysis
    $('h1').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text) extractedData.seoData.h1.push(text);
    });

    $('h2').slice(0, 10).each((i, elem) => {
      const text = $(elem).text().trim();
      if (text) extractedData.seoData.h2.push(text);
    });

    $('h3').slice(0, 10).each((i, elem) => {
      const text = $(elem).text().trim();
      if (text) extractedData.seoData.h3.push(text);
    });

    // Extract business information
    extractedData.businessInfo.companyName =
      $('[itemscope] [itemprop="name"]').first().text().trim() ||
      $('.company-name').text().trim() ||
      $('footer .brand').text().trim() ||
      '';

    // Extract certifications
    const certPatterns = ['ISO', 'FSSC', 'BRC', 'Organic', 'Kosher', 'Halal', 'FDA'];
    certPatterns.forEach(cert => {
      if (bodyText.includes(cert)) {
        extractedData.businessInfo.certifications.push(cert);
      }
    });

    // Add Excel-provided product data if available
    if (productName) {
      extractedData.providedProductName = productName;
    }
    if (category) {
      extractedData.providedCategory = category;
    }

    // Extract additional detailed content paragraphs
    const contentSelectors = [
      '.product-description p',
      '.product-details p',
      '.product-info p',
      'article p',
      '.content p',
      'main p'
    ];

    contentSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.length > 30 && extractedData.additionalContent.length < 10) {
          extractedData.additionalContent.push(text);
        }
      });
    });

    // Extract breadcrumb for category understanding
    const breadcrumb = [];
    $('.breadcrumb a, nav[aria-label="breadcrumb"] a').each((i, elem) => {
      breadcrumb.push($(elem).text().trim());
    });
    extractedData.breadcrumb = breadcrumb;

    // Extract any JSON-LD structured data
    const jsonLdScripts = $('script[type="application/ld+json"]');
    if (jsonLdScripts.length > 0) {
      try {
        extractedData.structuredData = JSON.parse(jsonLdScripts.first().html());
      } catch (e) {
        // Ignore parsing errors
      }
    }

    return res.status(200).json(extractedData);

  } catch (error) {
    console.error('Enhanced scraping error:', error.message);

    // Return partial data even on error
    return res.status(200).json({
      url: url,
      title: 'Product',
      description: 'Unable to fully scrape the page',
      price: '',
      images: [],
      features: [],
      specifications: {},
      additionalContent: [],
      error: error.message,
      fallback: true
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    responseLimit: '4mb',
  },
}