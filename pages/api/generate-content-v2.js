import Anthropic from '@anthropic-ai/sdk';
import path from 'path';
const { getPromptsForCategory } = require(path.resolve(process.cwd(), 'lib/prompts/selector.js'));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Business Research Prompt
const BUSINESS_RESEARCH_PROMPT = `You are a senior SEO strategist and business analyst with 30+ years of experience in digital marketing, competitive analysis, and business intelligence. You have an expert-level understanding of how businesses operate across all industries, market segments, and business models.

Your Mission: Conduct a comprehensive, forensic-level analysis of the provided website data to create a complete business intelligence report.

Analyze the following scraped website data and provide a detailed business intelligence report:

URL: {URL}
Domain: {DOMAIN}
Product Title: {TITLE}
Description: {DESCRIPTION}
Full Text Content: {FULL_TEXT}
Features: {FEATURES}
Specifications: {SPECIFICATIONS}
Additional Content: {ADDITIONAL_CONTENT}
SEO Data: {SEO_DATA}
Business Info: {BUSINESS_INFO}

Provide your analysis in this exact structure:

EXECUTIVE SUMMARY
One paragraph overview of the business, its primary function, and market position

BUSINESS PROFILE
- Company Name:
- Industry:
- Business Model:
- Target Market:
- Geographic Scope:
- Product Category:

PRODUCTS & SERVICES BREAKDOWN
Detailed list with descriptions and positioning

TARGET AUDIENCE ANALYSIS
- Primary Demographics:
- Secondary Audiences:
- Customer Personas:
- B2B vs B2C Classification:

MARKET POSITIONING
- Unique Selling Propositions:
- Competitive Advantages:
- Brand Personality:
- Pricing Strategy:

SEO STRATEGIC INSIGHTS
- Primary Keywords to Target:
- Content Gaps:
- Technical SEO Opportunities:

Be specific and extract actual information from the provided data. Do not make generic assumptions.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, scrapedData, productName, category } = req.body;

  if (!url || !scrapedData) {
    return res.status(400).json({ error: 'URL and scraped data are required' });
  }

  try {
    console.log('Starting content generation for:', url);
    console.log('Scraped data keys:', Object.keys(scrapedData));

    // Build product context with Excel data if available
    const productContext = productName || category ? `

**IMPORTANT - Excel-Provided Product Information:**
${productName ? `- Product Name: ${productName}` : ''}
${category ? `- Category: ${category}` : ''}

Use this information to provide more accurate and targeted product descriptions.` : '';

    // Step 1: Conduct Business Research using Claude Sonnet
    const businessResearchPrompt = BUSINESS_RESEARCH_PROMPT
      .replace('{URL}', url)
      .replace('{DOMAIN}', scrapedData.domain || new URL(url).hostname)
      .replace('{TITLE}', scrapedData.providedProductName || scrapedData.title || productName || '')
      .replace('{DESCRIPTION}', scrapedData.description || '')
      .replace('{FULL_TEXT}', scrapedData.fullTextContent || scrapedData.additionalContent?.join(' ') || '')
      .replace('{FEATURES}', JSON.stringify(scrapedData.features || []))
      .replace('{SPECIFICATIONS}', JSON.stringify(scrapedData.specifications || {}))
      .replace('{ADDITIONAL_CONTENT}', JSON.stringify(scrapedData.additionalContent || []))
      .replace('{SEO_DATA}', JSON.stringify(scrapedData.seoData || {}))
      .replace('{BUSINESS_INFO}', JSON.stringify(scrapedData.businessInfo || {})) + productContext;

    console.log('Conducting business research analysis...');

    let businessResearch = '';
    try {
      const researchResponse = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.3,
        system: "You are a senior business analyst conducting thorough research for SEO content generation.",
        messages: [{
          role: 'user',
          content: businessResearchPrompt
        }]
      });
      businessResearch = researchResponse.content[0].text;
      console.log('Business research completed successfully');
    } catch (error) {
      console.error('Business research error:', error);
      businessResearch = `Product Category: ${scrapedData.title || 'Food Ingredient'}
Industry: Food & Beverage Manufacturing
Target Market: UK Food Manufacturers
Business Model: B2B Supplier`;
    }

    // Step 2: Get industry-specific prompts based on category
    console.log('Selecting prompts for category:', scrapedData.providedCategory || category || 'unknown');
    const PROMPTS = getPromptsForCategory(
      scrapedData.providedCategory || category || scrapedData.breadcrumb?.join(' ') || '',
      scrapedData.businessInfo?.companyName || null
    );
    console.log('Selected prompts for detected industry');

    // Step 3: Generate content using Claude with business research context
    const content = {};

    async function generateWithPrompt(promptKey, additionalContext = {}) {
      const prompt = PROMPTS[promptKey];
      if (!prompt) {
        console.error(`Prompt not found for key: ${promptKey}`);
        return null;
      }

      let userPrompt = prompt.user
        .replace('{BUSINESS_RESEARCH}', businessResearch)
        .replace('{URL}', url)
        .replace('{TITLE}', scrapedData.providedProductName || scrapedData.title || productName || '')
        .replace('{DESCRIPTION}', scrapedData.description || '')
        .replace('{PRODUCT_TITLE}', content.productTitle || scrapedData.providedProductName || scrapedData.title || productName || '')
        .replace('{META_DESCRIPTION}', content.metaDescription || '')
        .replace('{PRODUCT_URL}', content.productUrl || url)
        .replace('{FEATURES}', JSON.stringify(scrapedData.features || []))
        .replace('{SPECIFICATIONS}', JSON.stringify(scrapedData.specifications || {}))
        .replace('{ADDITIONAL_CONTENT}', JSON.stringify(scrapedData.additionalContent || []))
        .replace('{SEO_DATA}', JSON.stringify(scrapedData.seoData || {}))
        .replace('{TARGET_MARKET}', additionalContext.targetMarket || 'UK Food Manufacturers')
        .replace('{PRODUCT_CATEGORY}', scrapedData.providedCategory || category || 'Food Ingredient')
        .replace('{USPS}', JSON.stringify(additionalContext.usps || []));

      // Add product context to all prompts
      userPrompt += productContext;

      try {
        console.log(`Generating ${promptKey}...`);
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          temperature: 0.4,
          system: prompt.system,
          messages: [{
            role: 'user',
            content: userPrompt
          }]
        });

        const result = response.content[0].text.trim();
        console.log(`Generated ${promptKey} successfully`);
        return result;
      } catch (error) {
        console.error(`Error generating ${promptKey}:`, error.message);
        return null;
      }
    }

    // Generate content in sequence with dependencies
    // First: Product Title (needed for URL, meta description, etc.)
    content.productTitle = await generateWithPrompt('productTitle');
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting

    // Second: Product URL (depends on title)
    content.productUrl = await generateWithPrompt('productUrl');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Third: Meta Description (depends on title)
    content.metaDescription = await generateWithPrompt('metaDescription');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fourth: Meta Title (depends on title)
    content.metaTitle = await generateWithPrompt('metaTitle');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fifth: Introduction (depends on title and meta)
    content.introduction = await generateWithPrompt('introduction');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate remaining content in parallel
    const parallelGenerations = await Promise.all([
      generateWithPrompt('featuresAndBenefits'),
      generateWithPrompt('technicalSpecs'),
      generateWithPrompt('useCases'),
      generateWithPrompt('seoKeywords'),
      generateWithPrompt('faqs'),
      generateWithPrompt('callToActions')
    ]);

    content.featuresAndBenefits = parallelGenerations[0];
    content.technicalSpecs = parallelGenerations[1];
    content.useCases = parallelGenerations[2];
    content.seoKeywords = parallelGenerations[3];
    content.faqs = parallelGenerations[4];
    content.callToActions = parallelGenerations[5];

    // Process and format the content

    // Clean up product URL if needed
    if (content.productUrl) {
      // Ensure it starts with the correct domain
      if (!content.productUrl.startsWith('https://www.geraldmcdonald.com')) {
        if (content.productUrl.startsWith('/')) {
          content.productUrl = 'https://www.geraldmcdonald.com' + content.productUrl;
        } else if (!content.productUrl.startsWith('http')) {
          content.productUrl = 'https://www.geraldmcdonald.com/products/' + content.productUrl;
        }
      }
      // Ensure it ends with /
      if (!content.productUrl.endsWith('/')) {
        content.productUrl += '/';
      }
    }

    // Parse features and benefits - ensure exactly 7 bullets
    if (content.featuresAndBenefits) {
      const rawContent = content.featuresAndBenefits;
      const lines = rawContent.split('\n');

      const bullets = lines
        .map(line => line.trim())
        .filter(line => {
          return line.startsWith('•') ||
                 line.startsWith('-') ||
                 line.startsWith('*') ||
                 /^\d+\./.test(line);
        })
        .map(line => {
          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            return line.substring(1).trim();
          }
          return line.replace(/^\d+\.\s*/, '').trim();
        })
        .filter(line => line.length > 0);

      if (bullets.length > 0) {
        // Take exactly 7 bullets as per specification
        content.featuresAndBenefits = bullets.slice(0, 7);
      } else {
        content.featuresAndBenefits = [rawContent.trim()];
      }
    }

    // Parse technical specifications
    if (content.technicalSpecs) {
      const specsObject = {};
      const lines = content.technicalSpecs.split('\n').filter(line => line.trim());

      lines.forEach(line => {
        if (line.includes('|')) {
          const parts = line.split('|').map(s => s.trim());
          if (parts.length >= 2) {
            const key = parts[0];
            const value = parts[1];
            // Skip header rows
            if (key && value && key !== 'Property' && key !== 'Field' && value !== 'Value' && value !== 'Description') {
              specsObject[key] = value;
            }
          }
        }
      });

      content.technicalSpecs = Object.keys(specsObject).length > 0 ? specsObject : null;
    }

    // Parse use cases - ensure exactly 8 bullets
    if (content.useCases) {
      const rawContent = content.useCases;
      const lines = rawContent.split('\n');

      const bullets = lines
        .map(line => line.trim())
        .filter(line => {
          return line.startsWith('•') ||
                 line.startsWith('-') ||
                 line.startsWith('*') ||
                 /^\d+\./.test(line);
        })
        .map(line => {
          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            return line.substring(1).trim();
          }
          return line.replace(/^\d+\.\s*/, '').trim();
        })
        .filter(line => line.length > 0);

      if (bullets.length > 0) {
        // Take exactly 8 use cases as per specification
        content.useCases = bullets.slice(0, 8);
      } else {
        content.useCases = [rawContent.trim()];
      }
    }

    // Parse SEO keywords
    if (content.seoKeywords) {
      try {
        const keywordSections = content.seoKeywords.split('\n\n');
        const parsedKeywords = {
          primaryKeywords: [],
          commercialIntent: [],
          longTail: [],
          semantic: [],
          industrySpecific: []
        };

        keywordSections.forEach(section => {
          const lines = section.split('\n').filter(line => line.includes('|'));
          if (section.toUpperCase().includes('PRIMARY')) {
            parsedKeywords.primaryKeywords = lines.map(line => line.split('|')[0].trim()).filter(k => k);
          } else if (section.toUpperCase().includes('COMMERCIAL')) {
            parsedKeywords.commercialIntent = lines.map(line => line.split('|')[0].trim()).filter(k => k);
          } else if (section.toUpperCase().includes('LONG-TAIL') || section.toUpperCase().includes('LONG TAIL')) {
            parsedKeywords.longTail = lines.map(line => line.split('|')[0].trim()).filter(k => k);
          } else if (section.toUpperCase().includes('SEMANTIC') || section.toUpperCase().includes('LSI')) {
            parsedKeywords.semantic = lines.map(line => line.split('|')[0].trim()).filter(k => k);
          } else if (section.toUpperCase().includes('INDUSTRY')) {
            parsedKeywords.industrySpecific = lines.map(line => line.split('|')[0].trim()).filter(k => k);
          }
        });

        content.seoKeywords = parsedKeywords;
      } catch (e) {
        console.error('Error parsing SEO keywords:', e);
      }
    }

    // Parse FAQs - ensure exactly 7 Q&A pairs
    if (content.faqs) {
      const faqPairs = content.faqs.split(/\n\n+/).filter(pair =>
        pair.includes('Q:') && pair.includes('A:')
      );
      const parsedFaqs = faqPairs.map(pair => {
        const lines = pair.split('\n');
        const questionLine = lines.find(line => line.trim().startsWith('Q:'));
        const answerLine = lines.find(line => line.trim().startsWith('A:'));

        const question = questionLine?.replace(/^Q:\s*/i, '').trim();
        const answer = answerLine?.replace(/^A:\s*/i, '').trim();

        return { question, answer };
      }).filter(faq => faq.question && faq.answer);

      // Take exactly 7 FAQs as per specification
      content.faqs = parsedFaqs.slice(0, 7);
    }

    // Generate structured data with the new format
    content.structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          "name": content.productTitle || scrapedData.title,
          "description": content.metaDescription || scrapedData.description,
          "image": [],
          "brand": {
            "@type": "Brand",
            "name": "Gerald McDonald Ltd"
          },
          "manufacturer": {
            "@type": "Organization",
            "name": "Gerald McDonald Ltd",
            "foundingDate": "1952"
          },
          "offers": {
            "@type": "Offer",
            "price": "Contact for pricing",
            "priceCurrency": "GBP",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Gerald McDonald Ltd"
            }
          }
        }
      ]
    };

    // Add business research summary to response
    content.businessResearch = businessResearch;

    // Apply fallbacks for any missing content

    // Fallback for product title
    content.productTitle = content.productTitle || `${scrapedData.title || 'Premium Food Ingredient'} | Food-Grade Quality | BRC Certified`;

    // Fallback for product URL
    if (!content.productUrl) {
      const slug = (scrapedData.title || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      content.productUrl = `https://www.geraldmcdonald.com/products/${slug}/`;
    }

    // Fallback for meta description
    content.metaDescription = content.metaDescription ||
      `Source premium ${scrapedData.title || 'food ingredients'} from Gerald McDonald, the UK's trusted BRC-certified supplier. Quality assured for food manufacturing. Request specs today.`;

    // Fallback for meta title
    content.metaTitle = content.metaTitle ||
      `${(scrapedData.title || 'Premium Food Ingredient').substring(0, 35)} | Gerald McDonald Ltd`;

    // Fallback for introduction
    content.introduction = content.introduction ||
      `${scrapedData.title || 'This premium food ingredient'} is a versatile ingredient essential for manufacturers producing high-quality food products. As the UK's leading BRC-certified supplier since 1952, Gerald McDonald provides this product with consistent quality, perfect for industrial food production. Our carefully sourced and processed ingredients maintain their quality profile while meeting strict food safety standards, making them ideal for a wide range of food manufacturing applications.`;

    // Fallback for features and benefits (exactly 7)
    if (!content.featuresAndBenefits || !Array.isArray(content.featuresAndBenefits) || content.featuresAndBenefits.length < 7) {
      content.featuresAndBenefits = [
        'Custom blending capabilities with no minimum order quantities enable precise recipe development while reducing inventory costs and waste.',
        'BRC-certified facility with automated CIP/SIP systems ensures consistent product quality and compliance with international food safety standards.',
        'Strategic UK port location and flexible delivery schedules guarantee reliable supply chain management and faster time-to-market.',
        'In-house R&D support and trial blending services accelerate product development cycles while minimizing formulation risks.',
        'Multiple certifications (Kosher, Halal, Organic) open access to specialty markets and enhance product marketability.',
        'Computer-controlled blending facility (1,000L to 26,000L capacity) delivers precise consistency across both small and large production runs.',
        'Century of sourcing expertise ensures premium ingredient quality and stable supply through established global networks.'
      ];
    }

    // Fallback for technical specs
    if (!content.technicalSpecs || typeof content.technicalSpecs !== 'object' || Object.keys(content.technicalSpecs).length < 5) {
      content.technicalSpecs = {
        'Product Name': content.productTitle?.split('|')[0]?.trim() || scrapedData.title || 'Food Ingredient',
        'Product Type': 'Food Ingredient',
        'Appearance': 'As per specification',
        'Colour': 'Characteristic',
        'Packaging': 'Aseptic bags in drums or IBC containers',
        'Storage Conditions': 'Store in cool, dry conditions below 25°C',
        'Shelf Life': '12-24 months when unopened and properly stored',
        'Allergens': 'None (produced in facility handling various allergens)',
        'GMO Status': 'Non-GMO',
        'Country of Origin': 'Various approved sources',
        'Certifications': 'BRC AA Grade, FSSC 22000, HACCP, ISO 22000',
        'Microbiological Standard': 'Total Plate Count <1000 cfu/g',
        'Suitable For': 'Vegetarian, Vegan, Kosher, Halal (on request)'
      };
    }

    // Fallback for use cases (exactly 8)
    if (!content.useCases || !Array.isArray(content.useCases) || content.useCases.length < 8) {
      content.useCases = [
        'Perfect for premium British craft beverage makers seeking consistent base ingredients - provides reliable quality and authentic flavour profiles while maintaining year-round production standards.',
        'Ideal for high-end baby food manufacturers requiring clean-label ingredients - offers natural characteristics and smooth texture without added preservatives.',
        'Premium yogurt producers can incorporate at optimal concentrations into their products, achieving authentic taste and texture while maintaining clean label requirements for UK retail chains.',
        'Artisanal ice cream producers can incorporate the ingredient to create distinctive flavour profiles while maintaining clean label requirements for natural ingredients.',
        'Bakery manufacturers benefit from consistent quality for pastries and baked goods, ensuring uniform product quality across large-scale production runs.',
        'Confectionery producers can utilise the ingredient in gummies and sweets, achieving desired flavour profiles while meeting UK food safety standards.',
        'Ready meal manufacturers appreciate the convenience and consistency for sauce bases and flavour enhancement in premium prepared food ranges.',
        'Health and wellness brands can incorporate into protein shakes and functional beverages, adding natural appeal to sports nutrition products.'
      ];
    }

    // Fallback for FAQs (exactly 7)
    if (!content.faqs || !Array.isArray(content.faqs) || content.faqs.length < 7) {
      const productName = content.productTitle?.split('|')[0]?.trim() || 'this ingredient';
      content.faqs = [
        {
          question: `What certifications does Gerald McDonald's ${productName} meet for food manufacturing?`,
          answer: `Gerald McDonald's products meet BRC AA Grade certification standards and are available with Kosher, Halal, and Organic certifications upon request. All products comply with UK and EU food safety regulations and are manufactured in our BRC-certified Basildon facility.`
        },
        {
          question: 'How does Gerald McDonald ensure consistent quality across batches?',
          answer: 'Gerald McDonald maintains rigorous quality control through our BRC AA Grade certified facility in Basildon. We use computer-controlled blending systems, in-house laboratory testing, and comprehensive traceability from source to delivery, ensuring batch-to-batch consistency.'
        },
        {
          question: 'What is the minimum order quantity for custom ingredient blends?',
          answer: 'Gerald McDonald offers flexible ordering with no minimum quantity requirements for custom blends. Our facility can accommodate blending volumes from 1,000L to 26,000L, making us suitable for both small-batch specialty orders and large-scale production runs.'
        },
        {
          question: 'What is the typical lead time for custom blend development?',
          answer: 'Standard custom blend development typically takes 2-4 weeks from initial consultation to delivery. Our R&D team works closely with you throughout the process. Rush orders can be accommodated subject to capacity and ingredient availability.'
        },
        {
          question: 'Are samples available for product development and testing?',
          answer: 'Yes, Gerald McDonald provides samples for qualified food manufacturers. Contact our technical team to discuss your requirements and arrange sample delivery. Samples are typically dispatched within 48 hours of approval.'
        },
        {
          question: 'What are the storage requirements after delivery?',
          answer: 'Storage requirements vary by product type but generally require cool, dry conditions below 25°C away from direct sunlight. Specific storage instructions are provided with each delivery. Opened containers should be resealed and used within the recommended timeframe.'
        },
        {
          question: 'What technical support does Gerald McDonald provide for formulation?',
          answer: 'Gerald McDonald offers comprehensive technical support including formulation guidance, application testing, and ongoing consultation. Our experienced food technologists can advise on usage rates, compatibility, and optimisation for your specific applications. Contact us at +44 (0)1268 244900.'
        }
      ];
    }

    // Fallback for SEO keywords
    if (!content.seoKeywords || typeof content.seoKeywords !== 'object') {
      const baseProduct = scrapedData.title?.toLowerCase() || 'food ingredient';
      content.seoKeywords = {
        primaryKeywords: [baseProduct, `${baseProduct} supplier`, 'food ingredient UK'],
        commercialIntent: [`buy ${baseProduct}`, `${baseProduct} wholesale`, `bulk ${baseProduct} supplier`],
        longTail: [`${baseProduct} for food manufacturing`, `BRC certified ${baseProduct}`, `UK ${baseProduct} supplier`],
        semantic: ['food grade ingredient', 'industrial food supply', 'food manufacturing ingredient'],
        industrySpecific: ['BRC certified supplier', 'FSSC 22000', 'food ingredient manufacturer UK']
      };
    }

    // Fallback for call to action
    content.callToActions = content.callToActions ||
      `Request Your Sample & Technical Support Today | Backed by 70+ years of ingredient expertise, our technical team is ready to support your next product innovation. Contact our specialists at +44 (0)1268 244900 or email ingredients@geraldmcdonald.com for immediate sampling and specification assistance.`;

    console.log('Content generation completed successfully');
    return res.status(200).json(content);

  } catch (error) {
    console.error('Content generation error:', error);
    return res.status(500).json({
      error: 'Content generation failed',
      message: error.message,
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
    maxDuration: 60,
  },
}
