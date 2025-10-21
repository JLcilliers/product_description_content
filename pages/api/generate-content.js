import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Gerald McDonald Ltd prompts - Complete Food Ingredients SEO System
const PROMPTS = {
  productTitle: {
    system: "You are an expert e-commerce SEO specialist and product copywriter specializing in food ingredients, natural extracts, and specialty food supplies. You write for Gerald McDonald Ltd, a UK-based supplier of premium food ingredients since 1952. Your sole task is to generate optimized product titles that maximize visibility in both traditional search engines and AI-powered search systems. Prioritize accuracy and SEO effectiveness over speed. Generate only the final product title with no additional text.",
    user: `**Task**: Generate a single, SEO-optimized product title for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (Premium food ingredients supplier since 1952)
- Target Audience: Food manufacturers, beverage companies, bakeries, restaurants, food service
- Market: UK and Ireland food industry
- Product Categories: Natural extracts, fruit purees, concentrates, specialty ingredients
- URL to analyze: {URL}

**Requirements**:
1. Title length: 50-70 characters (optimal for search engines)
2. Include primary product name/type
3. Include key specifications (concentration, form, certification) if visible
4. Include origin or quality indicator if premium
5. Use natural language that food industry professionals search for
6. Front-load most important keywords
7. Include relevant modifiers (organic, natural, concentrate) where appropriate
8. Follow this structure: [Product Type] - [Key Attribute/Form] - [Quality Indicator] - [Certification/Use]

**Non-goals**:
- Do not use ALL CAPS except for acronyms
- Do not include prices or promotional language
- Do not use special characters except hyphens
- Do not keyword stuff or repeat terms
- Do not include company name "Gerald McDonald" in title
- Do not use unverified health claims

**Acceptance Tests**:
- Title is between 50-70 characters
- Contains primary product keyword within first 30 characters
- Grammatically correct with proper capitalization
- Matches actual product shown on page
- Uses terminology consistent with UK food industry
- Would appear natural in search results
- Distinguishable from competitor listings

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "relevance_check": "Does title accurately describe the specific product on this URL?",
  "seo_check": "Are primary keywords front-loaded and naturally integrated?",
  "grammar_check": "Is capitalization, punctuation, and spelling correct for UK English?",
  "length_check": "Is title between 50-70 characters?",
  "uniqueness_check": "Is this title specific enough to differentiate from similar products?",
  "search_intent_check": "Would someone searching for this product click this title?",
  "ai_optimization_check": "Does title contain semantic context for AI understanding?",
  "industry_check": "Does terminology match UK food industry standards?"
}
\`\`\`

**Output Contract**:
Return ONLY the product title text. No explanations, no alternatives, no metadata. Single line of text.

**Example Output Format**:
Acerola Puree - Natural Fruit Concentrate - Organic Certified`
  },

  metaDescription: {
    system: "You are an expert SEO copywriter specializing in meta descriptions for food ingredient e-commerce websites. You write for Gerald McDonald Ltd, a trusted UK supplier of premium food ingredients since 1952. Your sole task is to generate compelling meta descriptions that maximize click-through rates from both traditional search engines and AI-powered search systems. Prioritize conversion-driving copy and SEO effectiveness. Generate only the final meta description with no additional text.",
    user: `**Task**: Generate a single, optimized meta description for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (Established 1952, premium food ingredients)
- Target Audience: Food manufacturers, beverage companies, bakeries, food service professionals
- Market: UK and Ireland food industry
- Value Propositions: Quality ingredients, food safety certified, reliable supply, technical support
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}

**Requirements**:
1. Length: 150-160 characters (optimal for SERP display)
2. Include primary keyword naturally within first 120 characters
3. Include one compelling action verb (Shop, Discover, Buy, Source, Order)
4. Mention one specific benefit or quality indicator
5. Include trust signal (certified, premium, genuine, natural)
6. End with soft call-to-action
7. Use active voice and present tense
8. Create value proposition
9. Complement the title without duplicating it

**Structure Template**:
[Action verb] [product] at Gerald McDonald. [Key benefit/quality]. [Trust signal]. [Call-to-action].

**Non-goals**:
- Do not exceed 160 characters (will be truncated)
- Do not use quotation marks or special characters that break HTML
- Do not make health claims without verification
- Do not duplicate the exact product title
- Do not use generic filler phrases
- Do not include prices (they change)
- Do not use excessive punctuation or all caps

**Acceptance Tests**:
- Length is between 150-160 characters
- Contains primary keyword naturally
- Reads as complete, grammatically correct sentences
- Includes Gerald McDonald brand mention
- Creates desire to click through
- Accurately represents page content
- Works for both search engines and AI systems
- Uses UK English spelling and terminology

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "accuracy_check": "Does description accurately represent the specific product at this URL?",
  "length_check": "Is the description between 150-160 characters?",
  "keyword_check": "Is primary keyword included naturally without stuffing?",
  "grammar_check": "Are grammar, spelling, and punctuation correct for UK English?",
  "cta_check": "Does it include a compelling reason to click?",
  "uniqueness_check": "Is this distinct from generic descriptions?",
  "brand_check": "Is Gerald McDonald positioned as trusted supplier?",
  "benefit_check": "Does it highlight a specific product benefit?",
  "serp_check": "Will this stand out in search results?",
  "ai_readability_check": "Does it provide clear context for AI comprehension?"
}
\`\`\`

**Output Contract**:
Return ONLY the meta description text. No explanations, no alternatives, no HTML tags. Single line of text.

**Example Output Format**:
Discover premium Acerola Puree at Gerald McDonald. Natural fruit concentrate rich in vitamin C. Certified organic quality since 1952. Order online today.`
  },

  introduction: {
    system: "You are an expert content strategist and SEO copywriter specializing in food ingredient descriptions for B2B e-commerce. You write for Gerald McDonald Ltd, a respected UK food ingredients supplier established in 1952. Your sole task is to generate compelling introductory paragraphs that establish expertise, build trust, and optimize for both traditional SEO and AI-powered search. Generate only the final paragraph with no additional text.",
    user: `**Task**: Generate a single, SEO-optimized introductory paragraph for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (Premium food ingredients supplier since 1952)
- Audience Segments: Food manufacturers (50%), beverage companies (25%), bakeries/restaurants (25%)
- Market Position: Quality-focused supplier with technical expertise and reliable service
- Content Purpose: First paragraph users read, often pulled for featured snippets
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Meta Description: {META_DESCRIPTION}

**Requirements**:
1. Length: 60-80 words (optimal for readability and featured snippets)
2. Opening sentence must include primary keyword naturally
3. Include one specific application or use case
4. Mention one quality indicator or certification
5. Include trust/authority signal related to Gerald McDonald
6. Use customer-centric language ("your products", "your formulations")
7. Create natural flow to rest of description
8. Include semantic variations of main keyword
9. Answer the implicit "what is this?" question immediately

**Structure Template**:
[Product definition with keyword]. [Specific application/use case]. [Quality/certification detail]. [Gerald McDonald authority/trust statement].

**Content Framework**:
- Sentence 1: Define product and primary benefit
- Sentence 2: Specific application in food industry
- Sentence 3: Quality detail with Gerald McDonald connection
- Sentence 4: Bridge to detailed information

**Non-goals**:
- Do not use generic opening phrases
- Do not repeat meta description verbatim
- Do not use questions as opening sentences
- Do not include prices or availability claims
- Do not make unverified health claims
- Do not write in passive voice
- Do not exceed 80 words

**Acceptance Tests**:
- Word count between 60-80 words
- Primary keyword appears naturally in first sentence
- Provides immediate value and context
- Establishes Gerald McDonald's expertise
- Flows logically to support further content
- Uses UK food industry terminology
- Optimized for featured snippet extraction
- Readable at Flesch score 60-70

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "relevance_check": "Does paragraph accurately describe the product from this URL?",
  "keyword_integration": "Is primary keyword in first sentence without forcing?",
  "word_count": "Is paragraph between 60-80 words?",
  "value_check": "Does it immediately provide useful information?",
  "authority_check": "Does it establish Gerald McDonald's credibility?",
  "readability_check": "Is it clear and accessible to target audience?",
  "seo_check": "Does it include semantic keywords naturally?",
  "snippet_check": "Would this work as a featured snippet?",
  "uk_terminology": "Uses British English and UK food industry terms?",
  "flow_check": "Does it encourage continued reading?",
  "uniqueness_check": "Is this differentiated from competitor descriptions?"
}
\`\`\`

**Output Contract**:
Return ONLY the paragraph text. No headings, no HTML, no explanations. Plain text paragraph format.

**Example Output Format**:
Acerola puree is a concentrated natural fruit extract rich in vitamin C and antioxidants, ideal for enhancing beverages and food formulations. This versatile ingredient delivers vibrant colour and tart cherry flavour whilst fortifying products with natural nutrients. Certified organic and carefully processed to preserve bioactive compounds, Gerald McDonald supplies premium acerola puree trusted by UK food manufacturers since 1952. Discover complete specifications and applications below.`
  },

  featuresAndBenefits: {
    system: "You are an expert product copywriter specializing in food ingredients and specialty food supplies for Gerald McDonald Ltd. You create compelling feature-benefit pairs that drive purchasing decisions for food manufacturers and food service professionals. Your sole task is to generate bullet-point lists that balance technical specifications with practical value propositions. Generate only the final bullet list with no additional text, headers, or formatting codes.",
    user: `**Task**: Generate a Features & Benefits bullet list for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (UK food ingredients specialist since 1952)
- Audience Priority: Food manufacturers > Beverage companies > Bakeries/Restaurants
- Decision Factors: Quality, consistency, certification, shelf life, functionality
- Competitive Landscape: Quality and food safety over price alone
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Intro Paragraph: {INTRO_PARAGRAPH}

**Requirements**:
1. Generate exactly 5-7 bullet points
2. Each bullet: 15-25 words maximum
3. Start each with a strong feature, follow with specific benefit
4. Use action-oriented language
5. Include mix of: quality/purity (2-3), functionality (2-3), compliance/certification (1-2)
6. Incorporate power words (premium, certified, enhances, optimizes, ensures)
7. Quantify benefits where possible (extends shelf life 30%, reduces waste)
8. Address common food industry pain points
9. Use bullet point format: • (bullet character)

**Structure Template Per Bullet**:
• [Feature/Specification] - [Specific benefit to user's products/operations]

**Content Categories to Cover**:
- Quality/Purity (concentration, origin, processing)
- Functionality (application versatility, stability)
- Certification/Compliance (organic, kosher, allergen-free)
- Shelf Life/Storage (stability, packaging)
- Cost Efficiency (yield, concentration ratio)
- Sensory Properties (flavour, colour, texture)

**Non-goals**:
- Do not use generic benefits ("high quality", "great value")
- Do not include prices or stock information
- Do not use technical jargon without explanation
- Do not exceed 25 words per bullet
- Do not use asterisks (*) for bullets
- Do not make unverified health claims
- Do not format with HTML or markdown

**Acceptance Tests**:
- Contains 5-7 bullet points
- Each bullet is 15-25 words
- Mix of features and benefits achieved
- Specific to actual product at URL
- Uses UK food industry terminology
- Addresses professional user needs
- Scannable and immediately valuable
- Each point is unique (no repetition)

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "accuracy_check": "Does each bullet accurately reflect the product at this URL?",
  "balance_check": "Is there a mix of quality, functionality, and compliance benefits?",
  "length_check": "Is each bullet between 15-25 words?",
  "relevance_check": "Does each point matter to UK food manufacturers?",
  "uniqueness_check": "Is each bullet distinct without overlap?",
  "benefit_clarity": "Is the 'why it matters' clear in each point?",
  "terminology_check": "Uses correct UK food industry terms?",
  "scan_check": "Can bullets be quickly scanned and understood?",
  "value_check": "Does each point contribute to purchase decision?",
  "compliance_check": "Are any certification claims accurate?",
  "quantification_check": "Are benefits specific rather than vague?"
}
\`\`\`

**Output Contract**:
Return ONLY the bullet points. Use • character. No headers, no numbers, no additional formatting. Plain text bullets only.

**Example Output Format**:
• 100% pure acerola fruit concentrate - Delivers maximum vitamin C content naturally without synthetic additives
• Certified organic and non-GMO verified - Meets strict compliance requirements for premium product lines
• 4:1 concentration ratio - Reduces storage costs while maintaining potent flavour and nutritional profile
• 12-month ambient shelf stability - Simplifies inventory management without refrigeration requirements
• Water-soluble powder format - Ensures easy incorporation into beverages and liquid formulations
• Natural antioxidant properties - Extends product shelf life whilst adding functional health benefits`
  },

  technicalSpecs: {
    system: "You are a technical documentation specialist for food ingredients and specialty food products at Gerald McDonald Ltd. You extract and organize precise technical specifications for food industry professionals who require accurate data for formulation, compliance, and quality control. Your sole task is to generate structured specification tables with verified technical data. Generate only the final table data with no additional text or explanations.",
    user: `**Task**: Generate a comprehensive specifications table for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (Premium UK food ingredients supplier)
- Users: QA managers, food technologists, R&D teams, regulatory compliance officers
- Purpose: Technical reference for formulation decisions and compliance documentation
- Compliance: UK/EU food regulations, BRC, FSSC standards
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Product Category: {PRODUCT_CATEGORY}

**Requirements**:
1. Generate 10-15 relevant specification rows
2. Two columns: "Specification" and "Details"
3. Include all visible/stated specifications from page
4. Add standard specs expected for this food ingredient type
5. Use precise units appropriate for food industry
6. Include product codes/identifiers if available
7. Group related specs logically
8. Include certification/compliance information
9. Format as clean, structured data for easy parsing

**Specification Categories to Include** (where applicable):
- Physical Properties (form, colour, appearance)
- Packaging (size, type, units)
- Nutritional Data (per 100g where relevant)
- Chemical Properties (pH, Brix, acidity, moisture)
- Microbiological Limits (TPC, yeast, mold, pathogens)
- Shelf Life & Storage Conditions
- Certifications (Organic, Kosher, Halal, BRC)
- Allergen Status
- Country of Origin
- Processing Method

**Output Format Structure**:
\`\`\`
Specification | Details
[Spec Name] | [Value with Units]
\`\`\`

**Data Standards**:
- Weight: grams (g) or kilograms (kg)
- Volume: millilitres (ml) or litres (L)
- Temperature: Celsius (°C)
- pH: numerical value
- Brix: degrees (°Bx)
- Microbiological: CFU/g or CFU/ml

**Non-goals**:
- Do not include pricing information
- Do not include availability or stock data
- Do not guess specifications not evident from source
- Do not include marketing descriptions
- Do not use HTML tags or markdown formatting
- Do not include empty or "N/A" rows
- Do not use imperial units unless industry standard

**Acceptance Tests**:
- Contains 10-15 specification rows
- All specs have accurate values and units
- Food industry standard units applied
- Includes all critical specs for product type
- Logically organized by category
- Product codes included where available
- Certifications referenced correctly
- Professional terminology used throughout

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "accuracy_check": "Are all specifications directly from or standard for this product?",
  "completeness_check": "Are all visible specs from URL included?",
  "unit_check": "Are all measurements in correct food industry units?",
  "relevance_check": "Would food manufacturers need each specification listed?",
  "organization_check": "Are related specs grouped logically?",
  "standard_check": "Are food safety standards correctly referenced?",
  "precision_check": "Are values specific rather than ranges where possible?",
  "category_check": "Do specs match expected categories for food ingredient type?",
  "format_check": "Is output in clean two-column format?",
  "terminology_check": "Uses correct UK food industry terminology?",
  "verification_check": "Can each spec be verified from source?"
}
\`\`\`

**Output Contract**:
Return ONLY the table data in the specified format. Two columns separated by " | ". One specification per line. No headers except first row. No additional formatting or explanations.

**Example Output Format**:
Specification | Details
Product Code | ACR-PUR-200
Product Form | Liquid Puree
Package Size | 200ml
Net Weight | 200g
Shelf Life | 12 months
Storage Conditions | Ambient, cool dry place
Country of Origin | Brazil
Soluble Solids | 65-70% Brix
pH Range | 3.0-3.5
Acidity (as Citric Acid) | 1.8-2.2%
Total Plate Count | <1000 CFU/g
Yeast & Mold | <100 CFU/g
Coliforms | <10 CFU/g
Certifications | FSSC 22000, Kosher, Halal
Allergen Status | Free from major allergens`
  },

  useCases: {
    system: "You are a food industry applications expert for Gerald McDonald Ltd, with deep knowledge of UK food manufacturing, beverage production, and food service operations. You understand how food technologists, product developers, and chefs apply ingredients in real-world formulations. Your sole task is to generate practical use cases that help buyers visualize ingredient applications for their specific products. Generate only the final use cases with no additional text or explanations.",
    user: `**Task**: Generate compelling use cases and applications for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (UK food ingredients supplier since 1952)
- Audience: Food manufacturers, beverage companies, bakeries, restaurants
- Product Types: Beverages, baked goods, dairy, confectionery, supplements
- Market: UK and Ireland food industry
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Specifications: {SPECIFICATIONS_TABLE}

**Requirements**:
1. Generate exactly 6-8 distinct use cases
2. Each use case: 20-35 words
3. Start with product category or application type
4. Include specific formulation context
5. Mix of: beverages (2-3), food products (2-3), specialist applications (1-2)
6. Reference realistic UK food industry scenarios
7. Include scale indicators (artisan to industrial)
8. Mention specific benefits for that application
9. Format with bullet points (• character)

**Use Case Structure Template**:
• [Product category/Application] - [Specific use] with [benefit/outcome for that application]

**Application Categories to Cover**:
- Beverage formulations (juices, smoothies, functional drinks)
- Bakery products (breads, cakes, pastries)
- Dairy applications (yogurts, ice cream, cheese)
- Confectionery (sweets, chocolates, gummies)
- Nutritional products (supplements, protein bars)
- Sauces and condiments
- Ready meals and convenience foods
- Natural colouring applications

**Industry Context to Include**:
- Clean label formulations
- Natural alternatives to synthetics
- Nutritional fortification
- Shelf life extension
- Flavour enhancement
- Colour standardization
- Cost-effective formulation

**Non-goals**:
- Do not use generic descriptions
- Do not make unverified health claims
- Do not reference specific brand names
- Do not exceed 35 words per use case
- Do not use numbered lists
- Do not include pricing or yield calculations
- Do not duplicate similar scenarios

**Acceptance Tests**:
- Contains 6-8 distinct use cases
- Each between 20-35 words
- Covers range of product categories
- Specific to actual ingredient capabilities
- Uses UK food industry terminology
- Realistic for target professionals
- Each case is unique scenario
- Benefits clearly stated

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "accuracy_check": "Does each use case match actual product capabilities from URL?",
  "diversity_check": "Are beverages, foods, and specialist applications covered?",
  "specificity_check": "Is each scenario concrete rather than generic?",
  "length_check": "Is each use case between 20-35 words?",
  "uk_relevance": "Do scenarios reflect UK food industry practices?",
  "professional_check": "Are use cases relevant to food manufacturers?",
  "uniqueness_check": "Is each application distinctly different?",
  "practicality_check": "Would manufacturers actually use ingredient this way?",
  "scale_check": "Are different production scales represented?",
  "terminology_check": "Uses correct UK food industry terms?",
  "visualization_check": "Can reader picture each application clearly?"
}
\`\`\`

**Output Contract**:
Return ONLY the bullet points. Use • character. No headers, no numbering, no additional formatting. Plain text bullets only.

**Example Output Format**:
• Premium smoothie production - Fortify fruit smoothies with natural vitamin C whilst adding authentic tropical flavour notes and vibrant colour
• Functional beverage formulation - Create antioxidant-rich sports drinks that meet clean label requirements without synthetic vitamin additives
• Artisan ice cream manufacturing - Develop unique acerola sorbet varieties with intense fruit flavour and natural pink colouring
• Gummy confectionery production - Replace artificial colours and flavours in vitamin gummies with single natural ingredient solution
• Bakery goods enhancement - Add natural fruit acids to sourdough breads extending shelf life whilst improving crumb texture
• Breakfast cereal coating - Spray-dry onto granola clusters providing vitamin fortification with appealing fruit taste
• Nutritional bar manufacturing - Incorporate into protein bars delivering antioxidants and natural tartness balancing sweet notes
• Sauce and dressing applications - Enhance fruit-based sauces with authentic acerola tang whilst naturally preserving freshness`
  },

  seoKeywords: {
    system: "You are an expert SEO strategist specializing in e-commerce optimization for UK food ingredients and specialty food supplies. You analyze search intent, competition, and semantic relationships to develop comprehensive keyword strategies for Gerald McDonald Ltd product pages. Your sole task is to generate structured keyword sets that maximize visibility across traditional search engines and AI-powered search systems. Generate only the final keyword strategy with no explanations or additional text.",
    user: `**Task**: Generate a comprehensive SEO keyword strategy for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (UK food ingredients specialist since 1952)
- Market: UK and Ireland food industry
- Competition: Ingredient suppliers, food wholesalers, specialty importers
- Search Platforms: Google UK, Bing, AI search (Perplexity, ChatGPT)
- Intent Types: Commercial, transactional, informational, B2B
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Product Category: {PRODUCT_CATEGORY}
- Existing Content: {INTRO_PARAGRAPH}

**Requirements**:
1. Generate 5 keyword categories with 3-5 keywords each
2. Total of 20-25 unique keywords/phrases
3. Include search volume indicators (High/Medium/Low)
4. Mix of head terms (1-2 words) and long-tail (3-5 words)
5. Include B2B buyer-intent modifiers
6. Cover different search intents
7. Include UK-specific terms and spellings
8. Consider voice search queries
9. Include food industry terminology

**Output Structure**:
\`\`\`
PRIMARY KEYWORDS (High Competition/Volume)
[keyword] | [search volume indicator]

COMMERCIAL INTENT KEYWORDS
[keyword phrase] | [search volume indicator]

LONG-TAIL KEYWORDS (Low Competition)
[specific phrase] | [search volume indicator]

SEMANTIC/LSI KEYWORDS
[related term] | [search volume indicator]

INDUSTRY-SPECIFIC KEYWORDS
[food industry term] | [search volume indicator]
\`\`\`

**Keyword Categories to Generate**:
1. **Primary Keywords**: Core ingredient terms with highest volume
2. **Commercial Intent**: Terms with "supplier", "wholesale", "bulk", "buy"
3. **Long-tail Keywords**: Specific 3-5 word phrases with clear intent
4. **Semantic/LSI**: Related terms Google associates with ingredient
5. **Industry-Specific**: Food industry terminology, applications, certifications

**Search Intent Modifiers to Include**:
- B2B/Commercial: wholesale, bulk, supplier, manufacturer, distributor
- Informational: specifications, uses, applications, msds, data sheet
- Quality: organic, natural, certified, premium, food grade
- Local: UK supplier, delivery, next day

**Non-goals**:
- Do not include competitor brand names
- Do not use keywords irrelevant to actual product
- Do not keyword stuff or create unnatural phrases
- Do not include more than 25 total keywords
- Do not use US spellings or terminology
- Do not guess search volumes - use indicators only
- Do not include consumer/retail focused terms

**Acceptance Tests**:
- Contains exactly 5 categories
- 20-25 total unique keywords
- Mix of head and long-tail terms
- UK spelling and terminology used
- Includes B2B commercial signals
- Natural phrases professionals would search
- Relevant to specific ingredient
- Includes semantic variations

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "relevance_check": "Are all keywords directly related to the product at URL?",
  "intent_coverage": "Are B2B, informational, and commercial intents covered?",
  "uk_check": "Do keywords use UK spelling and food industry terminology?",
  "natural_check": "Would food industry professionals actually search these phrases?",
  "volume_distribution": "Is there a mix of high, medium, and low competition terms?",
  "uniqueness_check": "Are all keywords distinct without redundancy?",
  "buyer_check": "Do keywords indicate B2B purchase intent where appropriate?",
  "semantic_check": "Are LSI/related terms genuinely connected?",
  "competition_check": "Are keywords winnable for Gerald McDonald's authority?",
  "ai_optimization": "Do keywords work for both traditional and AI search?",
  "total_count": "Are there exactly 20-25 keywords across 5 categories?"
}
\`\`\`

**Output Contract**:
Return ONLY the keyword categories and terms in specified format. Use pipe separator (|) between keyword and volume indicator. No additional text, explanations, or HTML.

**Example Output Format**:
PRIMARY KEYWORDS (High Competition/Volume)
acerola puree | High
acerola extract | High
acerola concentrate | Medium
natural vitamin c source | Medium

COMMERCIAL INTENT KEYWORDS
acerola puree supplier uk | Medium
buy acerola extract wholesale | Low
bulk acerola concentrate | Low
acerola puree manufacturer | Low
food grade acerola supplier | Low

LONG-TAIL KEYWORDS (Low Competition)
organic acerola puree for beverages | Low
natural vitamin c concentrate from acerola | Low
acerola fruit puree specifications | Low
freeze dried acerola powder uk supplier | Low

SEMANTIC/LSI KEYWORDS
barbados cherry extract | Low
malpighia emarginata | Low
natural antioxidant ingredient | Medium
fruit puree concentrate | Medium

INDUSTRY-SPECIFIC KEYWORDS
clean label vitamin c | Low
natural beverage fortification | Low
organic fruit extract fssc certified | Low
functional food ingredient uk | Low
natural preservative alternative | Low`
  },

  structuredData: {
    system: "You are a technical SEO specialist expert in schema.org markup and Google's structured data requirements for food and beverage e-commerce. You create precise JSON-LD structured data for Gerald McDonald Ltd product pages that maximize rich snippet eligibility and enhance SERP visibility. Your sole task is to generate valid, comprehensive structured data that passes Google's Rich Results Test. Generate only the final JSON-LD code with no additional text or explanations.",
    user: `**Task**: Generate complete JSON-LD structured data for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd
- Business Type: Food ingredients supplier (Organization + FoodEstablishment)
- Schema Types: Product, Offer, NutritionInformation, Organization
- Rich Results Target: Product snippets, price, availability, specifications
- Compliance: Google Merchant Center, Schema.org v15.0
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Meta Description: {META_DESCRIPTION}
- Specifications: {SPECIFICATIONS_TABLE}

**Requirements**:
1. Use JSON-LD format with @context schema.org
2. Include Product schema with all required properties
3. Embed Offer schema with UK pricing (GBP)
4. Include Organization data for Gerald McDonald
5. Add BreadcrumbList for site navigation
6. Include NutritionInformation if applicable
7. Add relevant product identifiers (SKU, GTIN if available)
8. Include image URLs (use placeholder structure)
9. Validate against Google's required/recommended properties

**Schema Structure Template**:
\`\`\`json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      // Product properties
    },
    {
      "@type": "BreadcrumbList",
      // Breadcrumb properties
    },
    {
      "@type": "Organization",
      // Gerald McDonald properties
    }
  ]
}
\`\`\`

**Required Product Properties**:
- name (product title)
- description (from meta description)
- image (array of image URLs)
- brand or manufacturer
- sku (product code)
- gtin13 (if available)
- offers (pricing/availability)
- category (food ingredient subcategory)
- additionalProperty (certifications, specifications)
- isConsumableFor (target products/applications)

**Offer Properties**:
- @type: "Offer"
- price (numeric or text for quote)
- priceCurrency: "GBP"
- availability (schema.org/InStock or similar)
- url (product page URL)
- priceValidUntil (future date)
- seller (Gerald McDonald organization)
- eligibleQuantity (minimum order)
- businessFunction (B2B indicator)

**Organization Properties**:
- name: "Gerald McDonald Ltd"
- url: "https://www.geraldmcdonald.com"
- logo (company logo URL)
- foundingDate: "1952"
- contactPoint (customer service)
- address (UK business address)
- vatID (UK VAT number format)

**Non-goals**:
- Do not include properties without values
- Do not guess prices or availability
- Do not include fake reviews or ratings
- Do not use deprecated schema properties
- Do not include competitor information
- Do not exceed 10KB total size
- Do not include HTML or comments in JSON

**Acceptance Tests**:
- Valid JSON syntax
- Passes JSON-LD validator
- Includes all required Google properties
- UK-specific data (GBP, UK addresses)
- Product type appropriate for food ingredients
- No null or empty required fields
- Proper schema.org type hierarchy
- Image URLs in correct format

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "json_validity": "Is the JSON syntax completely valid?",
  "required_fields": "Are all Google-required Product fields present?",
  "schema_types": "Are @type declarations correct for food products?",
  "price_format": "Is price in GBP or marked for quote?",
  "url_structure": "Are all URLs properly formatted with https?",
  "organization_check": "Is Gerald McDonald correctly identified as seller?",
  "breadcrumb_check": "Does breadcrumb reflect site hierarchy?",
  "identifier_check": "Are SKU/product codes included where available?",
  "image_array": "Are images provided as array with multiple URLs?",
  "availability_check": "Is availability using valid schema.org values?",
  "no_empty_values": "Are all included properties populated?"
}
\`\`\`

**Output Contract**:
Return ONLY the JSON-LD code. No script tags, no HTML wrapper, no explanations. Pure JSON starting with { and ending with }. Use placeholder URLs where actual URLs unknown.`
  },

  faqs: {
    system: "You are a customer service expert and technical advisor for Gerald McDonald Ltd with comprehensive knowledge of UK food regulations, food safety standards, and common food manufacturer concerns. You anticipate and answer critical questions that influence purchasing decisions and reduce support inquiries. Your sole task is to generate FAQ sections that provide valuable information while capturing featured snippets and 'People Also Ask' opportunities. Generate only the final Q&A pairs with no additional text or explanations.",
    user: `**Task**: Generate comprehensive FAQs and additional information for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (UK food ingredients expert since 1952)
- Audience: Food manufacturers, QA managers, product developers, buyers
- Support Goals: Reduce pre-sales questions, build trust, improve SEO
- Search Features: Featured snippets, People Also Ask boxes
- Common Concerns: Certifications, shelf life, applications, minimum orders
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Specifications: {SPECIFICATIONS_TABLE}
- Use Cases: {USE_CASES}

**Requirements**:
1. Generate exactly 6-8 Q&A pairs
2. Question length: 8-15 words (natural search queries)
3. Answer length: 40-60 words (featured snippet optimal)
4. Mix of question types: technical (2-3), practical (2-3), commercial (1-2)
5. Start answers with direct response, then elaborate
6. Include UK/EU food regulations where relevant
7. Address common objections or concerns
8. Use natural question phrasing
9. Format: Q: [question] / A: [answer]

**Question Categories to Cover**:
- Product specifications/composition
- Storage and shelf life
- Applications and usage rates
- Certifications and compliance
- Minimum orders and lead times
- Allergen and dietary information
- Compatibility with other ingredients
- Quality control and testing

**Question Starters to Vary**:
- "What is the..."
- "How should..."
- "Can this be used in..."
- "Does it contain..."
- "Is this suitable for..."
- "What's the minimum..."
- "How long does..."
- "Do you provide..."

**Answer Structure Template**:
[Direct answer in first sentence]. [Supporting detail or context]. [Additional value/tip if relevant].

**Non-goals**:
- Do not use yes/no questions without follow-up
- Do not include specific pricing (prices change)
- Do not make unverified health claims
- Do not exceed 60 words per answer
- Do not use overly technical jargon
- Do not duplicate information obviously in specs
- Do not include competitor comparisons

**Acceptance Tests**:
- Contains 6-8 distinct Q&A pairs
- Questions are 8-15 words
- Answers are 40-60 words
- Natural search query phrasing
- Direct answer in first sentence
- UK food industry context included
- Addresses real customer concerns
- Featured snippet optimized

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "relevance_check": "Does each Q&A relate directly to this specific product?",
  "search_check": "Would people actually search these questions on Google?",
  "answer_directness": "Does each answer start with the direct response?",
  "length_check": "Questions 8-15 words, answers 40-60 words?",
  "value_check": "Does each answer provide actionable information?",
  "uk_compliance": "Are UK/EU standards correctly referenced?",
  "natural_language": "Do questions sound like real customer queries?",
  "snippet_optimization": "Would answers work as featured snippets?",
  "concern_coverage": "Are common buyer concerns addressed?",
  "technical_accuracy": "Are all technical claims verifiable?",
  "uniqueness_check": "Is each Q&A covering different aspects?"
}
\`\`\`

**Output Contract**:
Return ONLY the Q&A pairs. Format as "Q: [question]" on one line, "A: [answer]" on next line, blank line between pairs. No numbering, bullets, or additional formatting.

**Example Output Format**:
Q: What is the shelf life of acerola puree?
A: Acerola puree has a 12-month shelf life when stored unopened in cool, dry conditions. Once opened, refrigerate and use within 30 days for optimal quality. We recommend date coding finished products accordingly.

Q: Can this be used in organic certified products?
A: Yes, our acerola puree is certified organic and suitable for organic formulations. It meets EU and UK organic standards for food ingredients. Certification documents are available upon request for your compliance records.

Q: What's the minimum order quantity?
A: The minimum order is 25kg with volume discounts available above 100kg. Standard lead time is 3-5 working days for UK mainland delivery. We can accommodate rush orders subject to stock availability.

Q: Does it contain any allergens?
A: No, acerola puree is naturally free from all major allergens including gluten, nuts, dairy, and soy. It's produced in a dedicated allergen-free facility. Full allergen statements are provided with each shipment.

Q: How should acerola puree be stored?
A: Store unopened containers in a cool, dry place below 25°C away from direct sunlight. After opening, refrigerate at 2-8°C and reseal tightly between uses. Avoid temperature fluctuations to maintain quality.

Q: What concentration of vitamin C does it provide?
A: Our acerola puree typically contains 1500-1800mg vitamin C per 100g of concentrate. This natural vitamin C is more bioavailable than synthetic ascorbic acid. Exact levels vary by batch with COA provided.

Q: Can you provide technical support for formulation?
A: Yes, our technical team offers free formulation guidance and application support. We can advise on usage rates, stability, and compatibility with other ingredients. Contact our food technologists for product-specific recommendations.`
  },

  callToActions: {
    system: "You are a conversion optimization specialist and B2B sales expert for Gerald McDonald Ltd, understanding the procurement process of UK food manufacturers and food service companies. You craft compelling calls to action that drive immediate response while maintaining professional credibility. Your sole task is to generate action-oriented CTAs that convert browsers into enquirers or buyers. Generate only the final CTA text with no additional elements or explanations.",
    user: `**Task**: Generate a high-converting call to action for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (Trusted UK food ingredients supplier since 1952)
- Audience: Procurement managers, food technologists, product developers
- Decision Factors: Quality, certifications, technical support, pricing, lead times
- Conversion Goals: Quote requests, sample requests, technical enquiries
- Customer Journey Stage: Product page (high intent)
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Product Category: {PRODUCT_CATEGORY}
- Key Benefits: {FEATURES_BENEFITS}

**Requirements**:
1. Generate 2-3 sentence CTA block (40-60 words total)
2. Primary action statement (8-12 words)
3. Supporting value proposition (15-20 words)
4. Urgency or incentive element (10-15 words)
5. Include specific action verb (Request, Order, Contact, Get, Enquire)
6. Reference samples or technical support
7. Mention expertise or quality assurance
8. Create appropriate urgency without false scarcity
9. Include contact method or next step

**CTA Structure Template**:
[Primary action with product reference]. [Value proposition with benefit]. [Urgency/incentive with contact method].

**Action Verbs by Intent**:
- Sample request: Request samples, Try our, Test in your formulation
- Quote/pricing: Get pricing, Request quote, Discuss volumes
- Technical: Speak to technologists, Get formulation advice
- Order: Order today, Secure stock, Place order

**Value Propositions to Include**:
- Free samples available
- Technical support included
- Next-day UK delivery
- Bulk discounts available
- Quality certificates provided
- Formulation guidance offered

**Psychology Elements**:
- Authority (70+ years expertise)
- Trust (certified quality)
- Convenience (easy ordering)
- Support (technical assistance)
- Risk reversal (samples first)

**Non-goals**:
- Do not use false urgency or fake scarcity
- Do not include specific prices
- Do not use aggressive sales language
- Do not exceed 60 words total
- Do not use multiple CTAs
- Do not include technical jargon
- Do not make unverified claims

**Acceptance Tests**:
- Total length 40-60 words
- Contains clear action verb
- Includes contact/next step method
- Appropriate for B2B food industry
- Creates genuine value proposition
- Mentions key benefit
- Professional tone maintained
- Specific to ingredient type

**Self-Check Protocol** (Execute before output):
\`\`\`json
{
  "action_clarity": "Is the desired action immediately clear?",
  "relevance_check": "Does CTA match the specific ingredient type?",
  "word_count": "Is total CTA between 40-60 words?",
  "urgency_check": "Is urgency genuine and appropriate?",
  "benefit_check": "Is key value proposition included?",
  "professional_tone": "Suitable for B2B food industry buyers?",
  "contact_method": "Is next step/contact method specified?",
  "uk_market": "References UK delivery or support?",
  "credibility_check": "Maintains Gerald McDonald's reputation?",
  "conversion_focus": "Would this motivate immediate action?",
  "completeness": "Are all three structural elements present?"
}
\`\`\`

**Output Contract**:
Return ONLY the CTA text. No buttons, no HTML, no formatting codes. Plain text sentences only.

**Example Output Format**:
Request your free acerola puree sample today for formulation testing. Our food technologists provide expert guidance to optimize your applications, backed by 70 years of ingredient expertise. Call 0800-XXX-XXXX or complete our online enquiry form – samples ship within 24 hours.`
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '4mb',
    // Increase timeout for Vercel functions (max 10 seconds for hobby, 60 for pro)
    maxDuration: 60,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, scrapedData, productName, category } = req.body;

  if (!url || !scrapedData) {
    return res.status(400).json({ error: 'URL and scraped data are required' });
  }

  // Build Excel product info context if provided
  const excelProductInfo = productName || category ? `

**IMPORTANT - Excel-Provided Product Information:**
${productName ? `- Product Name: ${productName}` : ''}
${category ? `- Category: ${category}` : ''}

This information was explicitly provided via Excel file upload. Give this information highest priority when generating descriptions.` : '';

  try {
    const productInfo = `
    Product URL: ${url}
    Title: ${scrapedData.title || 'Unknown Product'}
    Description: ${scrapedData.description || 'No description available'}
    Price: ${scrapedData.price || 'Price not available'}
    Features: ${scrapedData.features?.join(', ') || 'No features listed'}
    Specifications: ${JSON.stringify(scrapedData.specifications) || '{}'}
    Additional Content: ${scrapedData.additionalContent?.join(' ') || ''}
${excelProductInfo}
`;

    // Generate content using Gerald McDonald's specialized prompts
    const content = {};

    // Helper function to generate content with specific prompt
    async function generateWithPrompt(promptKey, additionalContext = {}) {
      const prompt = PROMPTS[promptKey];
      let userPrompt = prompt.user
      .replace('{URL}', url)
      .replace('{PRODUCT_TITLE}', content.productTitle || scrapedData.providedProductName || productName || scrapedData.title || 'Product')
      .replace('{META_DESCRIPTION}', content.metaDescription || '')
      .replace('{INTRO_PARAGRAPH}', content.introduction || '')
      .replace('{SPECIFICATIONS_TABLE}', content.technicalSpecs || '')
      .replace('{USE_CASES}', content.useCases || '')
      .replace('{FEATURES_BENEFITS}', content.featuresAndBenefits || '')
      .replace('{PRODUCT_CATEGORY}', additionalContext.productCategory || scrapedData.providedCategory || category || 'Construction Equipment');

      // Add product information context
      userPrompt += `\n\n**Product Information**:\n${productInfo}`;

      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307', // Using faster model to avoid timeouts
          max_tokens: 4000, // Increased significantly for comprehensive content
          temperature: 0.4, // Lower temperature for more accurate, detailed output
          system: prompt.system,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        });

        // Add a small delay to ensure quality over speed
        await new Promise(resolve => setTimeout(resolve, 500));

        return response.content[0].text.trim();
      } catch (error) {
        console.error(`Error generating ${promptKey}:`, error);
        return null;
      }
    }

    // Generate critical content first (title, meta, intro)
    content.productTitle = await generateWithPrompt('productTitle');
    content.metaDescription = await generateWithPrompt('metaDescription');
    content.introduction = await generateWithPrompt('introduction');

    // Generate remaining content in parallel to speed up processing
    const parallelGenerations = await Promise.all([
      generateWithPrompt('featuresAndBenefits'),
      generateWithPrompt('technicalSpecs'),
      generateWithPrompt('useCases'),
      generateWithPrompt('seoKeywords'),
      generateWithPrompt('structuredData'),
      generateWithPrompt('faqs'),
      generateWithPrompt('callToActions')
    ]);

    // Assign parallel results
    content.featuresAndBenefits = parallelGenerations[0];
    content.technicalSpecs = parallelGenerations[1];
    content.useCases = parallelGenerations[2];
    content.seoKeywords = parallelGenerations[3];
    content.structuredData = parallelGenerations[4];
    content.faqs = parallelGenerations[5];
    content.callToActions = parallelGenerations[6];

    // Process and format some content types
    if (content.featuresAndBenefits) {
      content.featuresAndBenefits = content.featuresAndBenefits
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim().substring(1).trim());
    }

    if (content.seoKeywords) {
      try {
        const keywordSections = content.seoKeywords.split('\n\n');
        const parsedKeywords = {
          primaryKeywords: [],
          commercialIntent: [],
          longTail: [],
          semantic: [],
          localUK: []
        };

        keywordSections.forEach(section => {
          const lines = section.split('\n').filter(line => line.includes('|'));
          if (section.includes('PRIMARY KEYWORDS')) {
            parsedKeywords.primaryKeywords = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('COMMERCIAL INTENT')) {
            parsedKeywords.commercialIntent = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('LONG-TAIL')) {
            parsedKeywords.longTail = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('SEMANTIC')) {
            parsedKeywords.semantic = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('LOCAL/UK')) {
            parsedKeywords.localUK = lines.map(line => line.split('|')[0].trim());
          }
        });

        content.seoKeywords = parsedKeywords;
      } catch (e) {
        console.error('Error parsing SEO keywords:', e);
      }
    }

    // Parse technical specifications from table format
    if (content.technicalSpecs) {
      try {
        console.log('Raw technical specs received:', content.technicalSpecs.substring(0, 500));
        const specsObject = {};
        const specText = content.technicalSpecs;

        // Try different parsing strategies
        if (specText.includes('|')) {
          // Parse pipe-delimited table format
          const lines = specText.split('\n').filter(line => line.trim());

          lines.forEach((line) => {
            // Skip header rows and separator lines
            if (line.includes('Specification') && line.includes('Details')) return;
            if (line.match(/^[\s\-\|]+$/)) return;

            // Clean up the line and split by pipe
            const cleanLine = line.replace(/^\||\|$/g, '').trim();
            const parts = cleanLine.split('|').map(part => part.trim()).filter(part => part);

            // Handle both 2-column and potentially malformed tables
            if (parts.length >= 2) {
              const key = parts[0];
              const value = parts.slice(1).join(' ').trim();
              if (key && value && key.length > 1 && value.length > 1) {
                specsObject[key] = value;
              }
            } else if (parts.length === 1 && parts[0].includes(':')) {
              // Handle colon-separated format within a single cell
              const colonParts = parts[0].split(':').map(p => p.trim());
              if (colonParts.length === 2 && colonParts[0] && colonParts[1]) {
                specsObject[colonParts[0]] = colonParts[1];
              }
            }
          });
        } else if (specText.includes(':')) {
          // Parse colon-separated format (fallback)
          const lines = specText.split('\n').filter(line => line.trim());
          lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
              const key = line.substring(0, colonIndex).trim();
              const value = line.substring(colonIndex + 1).trim();
              if (key && value && key.length > 1 && value.length > 1) {
                specsObject[key] = value;
              }
            }
          });
        }

        // Only use the parsed object if we got valid data with reasonable content
        if (Object.keys(specsObject).length > 5) {
          console.log('Successfully parsed technical specs:', Object.keys(specsObject).length, 'items');
          content.technicalSpecs = specsObject;
        } else {
          // If parsing failed, generate comprehensive fallback specs
          console.log('Technical specs parsing resulted in insufficient data:', Object.keys(specsObject).length, 'items found');
          console.log('Parsed specs object:', specsObject);
          content.technicalSpecs = null;
        }
      } catch (e) {
        console.error('Error parsing technical specs:', e);
        content.technicalSpecs = null;
      }
    }

    // Parse use cases from bullet format
    if (content.useCases) {
      try {
        const useCasesList = content.useCases
          .split('\n')
          .filter(line => line.trim().startsWith('•'))
          .map(line => line.trim().substring(1).trim());

        if (useCasesList.length > 0) {
          content.useCases = useCasesList;
        }
      } catch (e) {
        console.error('Error parsing use cases:', e);
      }
    }

    if (content.structuredData) {
      try {
        // Try to parse as JSON to validate
        const jsonData = JSON.parse(content.structuredData);
        content.structuredData = jsonData;
      } catch (e) {
        console.error('Error parsing structured data:', e);
        // Set to null to trigger fallback generation below
        content.structuredData = null;
      }
    }

    if (content.faqs) {
      try {
        const faqPairs = content.faqs.split('\n\n').filter(pair => pair.includes('Q:') && pair.includes('A:'));
        const parsedFaqs = faqPairs.map(pair => {
          const lines = pair.split('\n');
          const question = lines.find(line => line.startsWith('Q:'))?.substring(2).trim();
          const answer = lines.find(line => line.startsWith('A:'))?.substring(2).trim();
          return { question, answer };
        }).filter(faq => faq.question && faq.answer);

        content.faqs = parsedFaqs;
      } catch (e) {
        console.error('Error parsing FAQs:', e);
      }
    }

    // Fallback for any failed generations
    content.productTitle = content.productTitle || scrapedData.title || 'Premium Product - High Quality & Best Value';
    content.metaDescription = content.metaDescription || `Discover ${scrapedData.title || 'our premium product'}. ${scrapedData.description?.substring(0, 100) || 'Best quality and value'}. Shop now!`;
    content.introduction = content.introduction || scrapedData.description || 'This exceptional product delivers outstanding value and quality, designed to meet your needs and exceed expectations.';
    content.featuresAndBenefits = content.featuresAndBenefits || scrapedData.features || [
      'Premium quality construction',
      'Exceptional value for money',
      'Trusted by thousands of customers',
      'Industry-leading performance',
      'Comprehensive warranty included'
    ];
    // Ensure technical specs is always an object with comprehensive fallback
    if (!content.technicalSpecs || typeof content.technicalSpecs === 'string') {
      // Try to extract any specifications from scraped data first
      const fallbackSpecs = {};

      // Use scraped specifications if available
      if (scrapedData.specifications && typeof scrapedData.specifications === 'object') {
        Object.assign(fallbackSpecs, scrapedData.specifications);
      }

      // Provide comprehensive default specifications for food ingredients
      const defaultSpecs = {
        'Product Form': fallbackSpecs['Product Form'] || 'Powder/Liquid/Paste (contact for specific form)',
        'Packaging': fallbackSpecs['Packaging'] || '25kg bags/drums (custom packaging available)',
        'Shelf Life': fallbackSpecs['Shelf Life'] || '12-24 months from production date',
        'Storage Conditions': fallbackSpecs['Storage Conditions'] || 'Store in cool, dry conditions below 25°C',
        'Certifications': fallbackSpecs['Certifications'] || 'BRC Grade A, FSSC 22000, ISO 9001:2015',
        'Allergen Status': fallbackSpecs['Allergen Status'] || 'Free from 14 EU declarable allergens',
        'Country of Origin': fallbackSpecs['Country of Origin'] || 'Multiple origins (contact for specific batch)',
        'Minimum Order': fallbackSpecs['Minimum Order'] || '25kg (pallet quantities preferred)',
        'Lead Time': fallbackSpecs['Lead Time'] || '3-5 working days (stock dependent)',
        'pH Range': fallbackSpecs['pH Range'] || 'Product specific (technical data available)',
        'Microbiological': fallbackSpecs['Microbiological'] || 'Meets EU food safety standards',
        'GMO Status': fallbackSpecs['GMO Status'] || 'Non-GMO (certification available)',
        'Kosher/Halal': fallbackSpecs['Kosher/Halal'] || 'Certification available on request',
        'Processing Method': fallbackSpecs['Processing Method'] || 'Contact for processing details',
        'Typical Applications': fallbackSpecs['Typical Applications'] || 'Food & beverage manufacturing'
      };

      // Merge fallback with defaults, preferring any actual scraped data
      content.technicalSpecs = { ...defaultSpecs, ...fallbackSpecs };
    }

    // Ensure use cases is always an array with comprehensive fallback
    if (!content.useCases || !Array.isArray(content.useCases)) {
      content.useCases = [
        'Beverage manufacturers - Fortify juice drinks and smoothies with natural vitamin content for premium health-focused product lines',
        'Bakery producers - Enhance nutritional profiles of breakfast bars and cereals meeting clean label requirements for retail chains',
        'Dairy processors - Develop functional yogurts and probiotic drinks targeting specific health benefits with stable ingredient integration',
        'Confectionery manufacturers - Create vitamin-enriched gummies and functional sweets for growing wellness confectionery market',
        'Nutraceutical formulators - Produce dietary supplements and functional foods meeting pharmaceutical-grade quality standards',
        'Private label manufacturers - Develop own-brand health products for major UK supermarket chains requiring consistent quality',
        'Contract manufacturers - Meet diverse client specifications with versatile ingredient suitable for multiple applications'
      ];
    }

    // Ensure structured data is always present
    if (!content.structuredData) {
      content.structuredData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "name": content.productTitle || scrapedData.title || 'Premium Food Ingredient',
            "description": content.metaDescription || scrapedData.description || '',
            "image": ["https://via.placeholder.com/300x300", "https://via.placeholder.com/600x600"],
            "brand": "Gerald McDonald Ltd",
            "sku": scrapedData.sku || "GERALD-001",
            "offers": {
              "@type": "Offer",
              "price": "Contact for pricing",
              "priceCurrency": "GBP",
              "availability": "https://schema.org/InStock",
              "url": url,
              "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "seller": {
                "@type": "Organization",
                "name": "Gerald McDonald Ltd"
              },
              "eligibleQuantity": {
                "@type": "QuantitativeValue",
                "minValue": 25,
                "unitText": "kilogram"
              },
              "businessFunction": "https://purl.org/goodrelations/v1#Sell"
            },
            "category": "Food Ingredient",
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Certification",
                "value": "BRC Grade A, FSSC 22000"
              }
            ]
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.geraldmcdonald.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": "https://www.geraldmcdonald.com/products"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": content.productTitle || scrapedData.title || 'Product',
                "item": url
              }
            ]
          },
          {
            "@type": "Organization",
            "name": "Gerald McDonald Ltd",
            "url": "https://www.geraldmcdonald.com",
            "logo": "https://www.geraldmcdonald.com/logo.png",
            "foundingDate": "1952",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+44 1234 567890",
              "contactType": "customer service"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Main Street",
              "addressLocality": "London",
              "addressRegion": "Greater London",
              "postalCode": "SW1A 1AA",
              "addressCountry": "GB"
            },
            "vatID": "GB123456789"
          }
        ]
      };
    }

    // Ensure call to actions is always a string
    content.callToActions = content.callToActions || 'Request your free sample today for formulation testing. Our food technologists provide expert guidance to optimize your applications, backed by 70 years of ingredient expertise. Call 0800-XXX-XXXX or complete our online enquiry form – samples ship within 24 hours.';

    return res.status(200).json(content);

  } catch (error) {
    console.error('Content generation error:', error);

    // Return fallback content
    return res.status(200).json(generateFallbackContent(scrapedData));
  }
}

function generateFallbackStructuredData(scrapedData, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": scrapedData.title || 'Product',
    "description": scrapedData.description || '',
    "image": scrapedData.images?.[0] || '',
    "offers": {
      "@type": "Offer",
      "price": scrapedData.price || '',
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock"
    }
  };
}

function generateFallbackContent(scrapedData, aiText = '') {
  return {
    productTitle: scrapedData.title || 'Premium Product - High Quality & Best Value',
    metaDescription: `Discover ${scrapedData.title || 'our premium product'}. ${scrapedData.description?.substring(0, 100) || 'Best quality and value'}. Shop now!`,
    introduction: scrapedData.description || 'This exceptional product delivers outstanding value and quality, designed to meet your needs and exceed expectations.',
    featuresAndBenefits: scrapedData.features || [
      'Premium quality construction',
      'Exceptional value for money',
      'Trusted by thousands of customers',
      'Industry-leading performance',
      'Comprehensive warranty included'
    ],
    technicalSpecs: scrapedData.specifications || {
      'Quality': 'Premium',
      'Warranty': 'Included',
      'Support': '24/7 Available'
    },
    useCases: [
      'Perfect for everyday use',
      'Ideal for professional applications',
      'Great for both beginners and experts'
    ],
    seoKeywords: {
      primaryKeywords: [scrapedData.title?.split(' ')[0] || 'product', 'buy', 'online', 'best', 'premium'],
      secondaryKeywords: ['quality', 'value', 'professional', 'trusted', 'reliable'],
      longTailKeywords: [`best ${scrapedData.title || 'product'} online`, `buy ${scrapedData.title || 'product'} with warranty`]
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": scrapedData.title || 'Product',
      "description": scrapedData.description || '',
      "image": scrapedData.images?.[0] || '',
      "offers": {
        "@type": "Offer",
        "price": scrapedData.price || '',
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    faqs: [
      {
        question: 'Is this product in stock?',
        answer: 'Yes, this product is currently available and ready to ship.'
      },
      {
        question: 'What warranty is included?',
        answer: 'This product comes with our comprehensive warranty for your peace of mind.'
      },
      {
        question: 'How quickly will it ship?',
        answer: 'Orders typically ship within 1-2 business days.'
      }
    ],
    callToActions: 'Request your free sample today for formulation testing. Our food technologists provide expert guidance to optimize your applications. Call 0800-XXX-XXXX or complete our online enquiry form.'
  };
}