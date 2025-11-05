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

// Default prompts (will be replaced by industry-specific prompts from selector)
const DEFAULT_PROMPTS = {
  productTitle: {
    system: "You are an expert e-commerce SEO specialist for Gerald McDonald Ltd, a UK-based premium food ingredients supplier since 1952. Generate SEO-optimized product titles that maximize visibility in search engines and AI-powered search systems. Focus on accuracy, relevance, and keyword optimization.",
    user: `Based on the business research and scraped data, generate an SEO-optimized product title.

**Business Research**:
{BUSINESS_RESEARCH}

**Product Data**:
- Current Title: {TITLE}
- Description: {DESCRIPTION}
- Specifications: {SPECIFICATIONS}
- Features: {FEATURES}

**SEO Requirements**:
1. Length: 60-80 characters for optimal SERP display
2. Include primary product keyword at the start
3. Add descriptive qualifiers (Premium, Industrial, Professional-Grade, etc.)
4. Include key specifications or certifications if available (BRC Certified, Food-Grade, etc.)
5. Use natural language that industry professionals actually search for
6. Structure: [Descriptor] [Product Type] | [Key Attribute] | [Certification/Quality]

**Example Format**: "Premium Apple Medium Acid Puree | Food-Grade Industrial Ingredient | BRC Certified"

Generate ONLY the product title. No explanations.`
  },

  metaDescription: {
    system: "You are an expert SEO copywriter for Gerald McDonald Ltd. Create compelling meta descriptions that maximize click-through rates from search results while accurately representing the product.",
    user: `Based on the business research and product title, generate an optimized meta description.

**Business Research**:
{BUSINESS_RESEARCH}

**Product Title**: {PRODUCT_TITLE}
**Product Data**:
- Description: {DESCRIPTION}
- Features: {FEATURES}
- USPs: {USPS}

**Requirements**:
1. Length: 150-160 characters (will be truncated if longer)
2. Include primary keyword naturally
3. Include action verb (Shop, Discover, Source, Order)
4. Mention Gerald McDonald as trusted supplier
5. Include specific benefit or quality indicator
6. End with soft call-to-action

Generate ONLY the meta description. No explanations.`
  },

  introduction: {
    system: "You are a content strategist for Gerald McDonald Ltd. Write compelling introductory paragraphs that establish expertise, build trust, and are optimized for featured snippets in search results.",
    user: `Based on the business research, generate an SEO-optimized introduction paragraph.

**Business Research**:
{BUSINESS_RESEARCH}

**Product Context**:
- Title: {PRODUCT_TITLE}
- Meta Description: {META_DESCRIPTION}
- Key Features: {FEATURES}

**Requirements**:
1. Length: 80-120 words (more comprehensive)
2. First sentence: Define what the product is and its primary use
3. Second sentence: Mention Gerald McDonald as the UK's leading/trusted BRC-certified supplier since 1952
4. Third sentence: Highlight key quality attributes and certifications
5. Fourth sentence: Mention ideal applications or target industries
6. Use specific, concrete language - avoid generic descriptions
7. Include relevant industry terminology

**Example opening**: "[Product] is a versatile food ingredient essential for manufacturers producing [applications]. As the UK's leading BRC-certified supplier since 1952, Gerald McDonald provides this high-quality [product] with consistent [attributes], perfect for industrial food production..."

Generate ONLY the paragraph. No explanations.`
  },

  featuresAndBenefits: {
    system: "You are a product copywriter for Gerald McDonald Ltd. Create feature-benefit pairs that drive purchasing decisions for food manufacturers and food service professionals.",
    user: `Based on the scraped features and business research, generate optimized feature-benefit bullets.

**Business Research**:
{BUSINESS_RESEARCH}

**Scraped Features**:
{FEATURES}

**Specifications**:
{SPECIFICATIONS}

**Requirements**:
1. Generate exactly 6 bullet points
2. Each bullet: 20-30 words
3. Format: Start with capability/feature, then "enables/ensures/guarantees" + specific business benefit with measurable outcome
4. Use bullet character: •
5. Include these themes:
   - Custom capabilities (flexibility, no minimums)
   - Certifications and compliance (BRC, food safety standards)
   - Supply chain advantages (UK location, delivery, reliability)
   - Technical support (R&D, trial services, formulation help)
   - Market access (certifications for specialty markets)
   - Quality consistency (automated systems, batch control)
6. Use power verbs: enables, ensures, guarantees, delivers, accelerates, reduces
7. Include specific outcomes: "reducing inventory costs", "faster time-to-market", "enhanced product marketability"

**Example**: "• Custom blending capabilities with no minimum order quantities enable precise recipe development while reducing inventory costs and waste."

Generate ONLY bullet points. No headers or explanations.`
  },

  technicalSpecs: {
    system: "You are a technical documentation specialist for Gerald McDonald Ltd. Extract and organize precise technical specifications for food industry professionals.",
    user: `Based on the scraped specifications and product data, generate a comprehensive specifications table.

**Scraped Specifications**:
{SPECIFICATIONS}

**Product Data**:
- Title: {TITLE}
- Features: {FEATURES}
- Additional Info: {ADDITIONAL_CONTENT}

**Requirements**:
1. Generate 10-15 specification rows
2. Format: Specification | Details
3. Include all scraped specs plus standard food industry specs
4. Use precise units (metric for UK market)
5. Include certifications, packaging, shelf life, storage
6. Group related specs logically

Generate ONLY the table in format:
Specification | Details
[spec] | [value]`
  },

  useCases: {
    system: "You are a food industry applications expert for Gerald McDonald Ltd. Generate practical use cases that help buyers visualize ingredient applications.",
    user: `Based on the business research and product specifications, generate compelling use cases.

**Business Research**:
{BUSINESS_RESEARCH}

**Product Type**: {PRODUCT_TITLE}
**Specifications**: {SPECIFICATIONS}
**Target Market**: {TARGET_MARKET}

**Requirements**:
1. Generate exactly 8 use cases
2. Each: 30-40 words
3. Format: "• Perfect/Ideal/Essential/Excellent for [specific customer type] [seeking/requiring specific need] - [provides/delivers/offers specific benefit with technical detail]."
4. Include diverse customer types:
   - Craft/artisanal manufacturers
   - Premium/luxury brands
   - Health-focused/clean-label producers
   - Industrial/large-scale manufacturers
   - Specialist/niche applications
5. Include specific technical benefits (viscosity, stability, fermentation, moisture retention, etc.)
6. Reference real UK market segments (British craft, premium ready-meals, etc.)
7. Use descriptive adjectives: premium, luxury, artisanal, gourmet, health-focused

**Example**: "• Perfect for premium British craft cider makers seeking a consistent base - provides reliable fermentation characteristics and authentic apple flavor while maintaining year-round production standards."

Generate ONLY bullet points. No headers.`
  },

  seoKeywords: {
    system: "You are an SEO strategist for Gerald McDonald Ltd. Develop comprehensive keyword strategies based on actual product data and search intent.",
    user: `Based on the business research and SEO data, generate a keyword strategy.

**Business Research**:
{BUSINESS_RESEARCH}

**SEO Data**:
{SEO_DATA}

**Product**: {PRODUCT_TITLE}

Generate keywords in this exact format:

PRIMARY KEYWORDS (High Competition/Volume)
[keyword] | High
[keyword] | High

COMMERCIAL INTENT KEYWORDS
[keyword phrase] | Medium
[keyword phrase] | Low

LONG-TAIL KEYWORDS (Low Competition)
[specific phrase] | Low

SEMANTIC/LSI KEYWORDS
[related term] | Medium

INDUSTRY-SPECIFIC KEYWORDS
[food industry term] | Low

Include 20-25 total keywords. Use UK spelling.`
  },

  faqs: {
    system: "You are a customer service expert for Gerald McDonald Ltd. Create FAQs that answer real customer questions while optimizing for People Also Ask features.",
    user: `Based on the business research and product data, generate comprehensive FAQs.

**Business Research**:
{BUSINESS_RESEARCH}

**Product**: {PRODUCT_TITLE}
**Specifications**: {SPECIFICATIONS}

**Requirements**:
1. Generate exactly 7 Q&A pairs
2. Question: 10-18 words (natural search queries starting with What/How/Can/Do/Does)
3. Answer: 50-70 words (detailed, featured snippet optimal)
4. Format: Q: [question]\\nA: [answer]
5. Cover these topics in order:
   - Certifications and compliance
   - Quality assurance processes
   - Minimum order quantities and flexibility
   - Lead time and development process
   - Sampling availability
   - Storage and handling requirements
   - Technical support and applications assistance
6. Include specific details: mention BRC, Gerald McDonald's Basildon facility, UK/EU regulations
7. Use conversational but professional tone
8. Include company contact methods in relevant answers

**Example**:
Q: What certifications does Gerald McDonald's [product] meet for food manufacturing?
A: Gerald McDonald's [product] meets BRC certification standards and is available with Kosher, Halal, and Organic certifications upon request. All products comply with UK and EU food safety regulations and are manufactured in our BRC-certified Basildon facility.

Generate ONLY Q&A pairs. One blank line between pairs.`
  },

  callToActions: {
    system: "You are a conversion specialist for Gerald McDonald Ltd. Create CTAs that drive immediate response from B2B food industry buyers.",
    user: `Based on the business research and product benefits, generate a high-converting CTA.

**Business Research**:
{BUSINESS_RESEARCH}

**Product**: {PRODUCT_TITLE}
**Key Benefits**: {FEATURES}

**Requirements**:
1. Length: 50-65 words
2. Structure: [Action headline] | [Value proposition with expertise] [Contact methods with specific details]
3. Start with "Request Your [Product Type] Sample Today" or similar action-oriented headline
4. Mention "Backed by 70+ years of ingredient expertise" or similar credibility statement
5. Include "technical team" or "specialists" ready to support
6. Provide specific contact: phone number format "+44 (0)1268 244900" and email "ingredients@geraldmcdonald.com"
7. Mention "immediate sampling" or "specification assistance"
8. Use power words: backed, comprehensive, immediate, specialist

**Example**: "Request Your Custom [Product] Sample Today | Backed by 70+ years of ingredient expertise, our technical team is ready to support your next product innovation. Contact our specialists at +44 (0)1268 244900 or email ingredients@geraldmcdonald.com for immediate sampling and specification assistance."

Generate ONLY the CTA text. No additional formatting or headers.`
  }
};

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

    // Step 1: Conduct Business Research using Claude Opus
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
        model: 'claude-3-5-sonnet-20241022', // Using latest Sonnet for research
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
        .replace('{FEATURES}', JSON.stringify(scrapedData.features || []))
        .replace('{SPECIFICATIONS}', JSON.stringify(scrapedData.specifications || {}))
        .replace('{ADDITIONAL_CONTENT}', JSON.stringify(scrapedData.additionalContent || []))
        .replace('{SEO_DATA}', JSON.stringify(scrapedData.seoData || {}))
        .replace('{TARGET_MARKET}', additionalContext.targetMarket || 'UK Food Manufacturers')
        .replace('{USPS}', JSON.stringify(additionalContext.usps || []));

      // Add product context to all prompts
      userPrompt += productContext;

      try {
        console.log(`Generating ${promptKey}...`);
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022', // Using latest Sonnet for quality
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
    content.productTitle = await generateWithPrompt('productTitle');
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting

    content.metaDescription = await generateWithPrompt('metaDescription');
    await new Promise(resolve => setTimeout(resolve, 500));

    content.introduction = await generateWithPrompt('introduction');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate remaining content
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

    // Parse features and benefits
    if (content.featuresAndBenefits) {
      content.featuresAndBenefits = content.featuresAndBenefits
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim().substring(1).trim());
    }

    // Parse technical specifications
    if (content.technicalSpecs) {
      const specsObject = {};
      const lines = content.technicalSpecs.split('\n').filter(line => line.trim());

      lines.forEach(line => {
        if (line.includes('|')) {
          const [key, value] = line.split('|').map(s => s.trim());
          if (key && value && key !== 'Specification' && value !== 'Details') {
            specsObject[key] = value;
          }
        }
      });

      content.technicalSpecs = Object.keys(specsObject).length > 0 ? specsObject : {
        'Product Form': scrapedData.specifications?.['Product Form'] || 'Contact for details',
        'Packaging': scrapedData.specifications?.['Packaging'] || '25kg standard packaging',
        'Shelf Life': scrapedData.specifications?.['Shelf Life'] || '12 months',
        'Storage': scrapedData.specifications?.['Storage'] || 'Cool, dry conditions'
      };
    }

    // Parse use cases
    if (content.useCases) {
      content.useCases = content.useCases
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim().substring(1).trim());
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
          if (section.includes('PRIMARY')) {
            parsedKeywords.primaryKeywords = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('COMMERCIAL')) {
            parsedKeywords.commercialIntent = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('LONG-TAIL')) {
            parsedKeywords.longTail = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('SEMANTIC')) {
            parsedKeywords.semantic = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('INDUSTRY')) {
            parsedKeywords.industrySpecific = lines.map(line => line.split('|')[0].trim());
          }
        });

        content.seoKeywords = parsedKeywords;
      } catch (e) {
        console.error('Error parsing SEO keywords:', e);
      }
    }

    // Parse FAQs
    if (content.faqs) {
      const faqPairs = content.faqs.split('\n\n').filter(pair => pair.includes('Q:') && pair.includes('A:'));
      content.faqs = faqPairs.map(pair => {
        const lines = pair.split('\n');
        const question = lines.find(line => line.startsWith('Q:'))?.substring(2).trim();
        const answer = lines.find(line => line.startsWith('A:'))?.substring(2).trim();
        return { question, answer };
      }).filter(faq => faq.question && faq.answer);
    }

    // Generate structured data
    const companyName = scrapedData.businessInfo?.companyName || "Gerald McDonald Ltd";
    const foundingDate = scrapedData.businessInfo?.founded || "1952";

    content.structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          "name": content.productTitle || scrapedData.title,
          "description": content.metaDescription || scrapedData.description,
          "image": scrapedData.images?.map(img => typeof img === 'string' ? img : img.url) || [],
          "brand": {
            "@type": "Brand",
            "name": companyName
          },
          "manufacturer": {
            "@type": "Organization",
            "name": companyName,
            "foundingDate": foundingDate
          },
          "offers": {
            "@type": "Offer",
            "price": scrapedData.price || "Contact for pricing",
            "priceCurrency": scrapedData.currency || "GBP",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": companyName
            }
          }
        }
      ]
    };

    // Add business research summary to response
    content.businessResearch = businessResearch;

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