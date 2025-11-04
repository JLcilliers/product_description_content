/**
 * Prompt Selector Utility
 * 
 * Automatically selects the appropriate prompt library based on product category.
 * Enables industry-adaptive content generation while maintaining SEO quality.
 */

const FOOD_INGREDIENTS_PROMPTS = require('./food-ingredients');

/**
 * Industry pattern matching configuration
 * Each industry has an array of regex patterns to match against product categories
 */
const INDUSTRY_PATTERNS = {
  foodIngredients: [
    // Direct ingredient mentions
    /ingredient/i,
    /additive/i,
    /flavor/i,
    /flavour/i,
    /extract/i,
    /powder/i,
    /concentrate/i,
    
    // Food categories
    /food/i,
    /culinary/i,
    /bakery/i,
    /dairy/i,
    /beverage/i,
    /confection/i,
    
    // Ingredient types
    /sweetener/i,
    /preservative/i,
    /colorant/i,
    /emulsifier/i,
    /stabilizer/i,
    /acid/i,
    /vitamin/i,
    /mineral/i,
    /protein/i,
    /starch/i,
    /gum/i,
    /thickener/i,
    
    // Specific ingredients
    /vanilla/i,
    /citric/i,
    /ascorbic/i,
    /lecithin/i,
    /pectin/i,
    /gelatin/i,
    /agar/i,
    /xanthan/i,
    /maltodextrin/i,
    /glucose/i,
    /fructose/i,
    /dextrose/i,
    /caramel/i,
    /cocoa/i,
    /chocolate/i,
    /spice/i,
    /herb/i,
    /seasoning/i,
    /salt/i,
    /sugar/i,
    
    // Industry terms
    /nutraceutical/i,
    /supplement/i,
    /functional food/i,
    /health food/i
  ],
  
  electronics: [
    /electronic/i,
    /semiconductor/i,
    /circuit/i,
    /component/i,
    /resistor/i,
    /capacitor/i,
    /microcontroller/i,
    /sensor/i,
    /led/i,
    /display/i
  ],
  
  generic: []
};

/**
 * Checks if a category matches any patterns for a specific industry
 * @param {string} category - Product category to test
 * @param {RegExp[]} patterns - Array of regex patterns to match against
 * @returns {boolean} True if category matches any pattern
 */
function matchesIndustry(category, patterns) {
  if (!category || typeof category !== 'string') {
    return false;
  }
  
  return patterns.some(pattern => pattern.test(category));
}

/**
 * Detects the industry based on product category
 * @param {string} category - Product category from Excel or scraped data
 * @returns {string} Industry identifier (foodIngredients, electronics, or generic)
 */
function detectIndustry(category) {
  // Test against food ingredients first (most common use case currently)
  if (matchesIndustry(category, INDUSTRY_PATTERNS.foodIngredients)) {
    return 'foodIngredients';
  }
  
  // Test against electronics
  if (matchesIndustry(category, INDUSTRY_PATTERNS.electronics)) {
    return 'electronics';
  }
  
  // Default to generic for unknown categories
  return 'generic';
}

/**
 * Gets food ingredients prompts with business name injection
 * @param {string|null} businessName - Optional business name to inject into prompts
 * @returns {Object} Food ingredients prompt library
 */
function getFoodIngredientsPrompts(businessName = null) {
  // If business name is provided, inject it into prompts
  if (businessName) {
    const prompts = { ...FOOD_INGREDIENTS_PROMPTS };
    
    // Inject business name into each prompt section
    Object.keys(prompts).forEach(key => {
      if (prompts[key] && typeof prompts[key] === 'string') {
        prompts[key] = prompts[key].replace(/\{businessName\}/g, businessName);
      }
    });
    
    return prompts;
  }
  
  return FOOD_INGREDIENTS_PROMPTS;
}

/**
 * Gets generic prompts (fallback for unknown industries)
 * Currently returns food ingredients as the most comprehensive fallback
 * @param {string|null} businessName - Optional business name to inject into prompts
 * @returns {Object} Generic prompt library
 */
function getGenericPrompts(businessName = null) {
  // For now, use food ingredients as the generic fallback
  // since it's the most comprehensive prompt library we have
  console.warn('Using food ingredients prompts as generic fallback');
  return getFoodIngredientsPrompts(businessName);
}

/**
 * Main function: Selects and returns appropriate prompts based on product category
 * @param {string} category - Product category from Excel or scraped data
 * @param {string|null} businessName - Optional business name to inject into prompts
 * @returns {Object} Appropriate prompt library for the category
 */
function getPromptsForCategory(category, businessName = null) {
  // Validate input
  if (!category || typeof category !== 'string') {
    console.warn('Invalid category provided to getPromptsForCategory, using generic prompts');
    return getGenericPrompts(businessName);
  }
  
  // Detect industry
  const industry = detectIndustry(category);
  console.log(`Category "${category}" detected as industry: ${industry}`);
  
  // Return appropriate prompts
  switch (industry) {
    case 'foodIngredients':
      return getFoodIngredientsPrompts(businessName);
    
    case 'electronics':
      // Electronics prompts not yet implemented, fall back to generic
      console.warn('Electronics prompts not yet implemented, using generic prompts');
      return getGenericPrompts(businessName);
    
    case 'generic':
    default:
      return getGenericPrompts(businessName);
  }
}

/**
 * Debug utility: Get detailed statistics about category detection
 * @param {string} category - Product category to analyze
 * @returns {Object} Detection statistics including matched patterns
 */
function getCategoryStats(category) {
  const industry = detectIndustry(category);
  const matchedPatterns = [];
  
  // Find which specific patterns matched
  for (const [industryName, patterns] of Object.entries(INDUSTRY_PATTERNS)) {
    const matched = patterns.filter(pattern => pattern.test(category || ''));
    if (matched.length > 0) {
      matchedPatterns.push({
        industry: industryName,
        patterns: matched.map(p => p.toString()),
        count: matched.length
      });
    }
  }
  
  return {
    category,
    detectedIndustry: industry,
    matchedPatterns,
    promptLibraryUsed: industry === 'foodIngredients' ? 'food-ingredients.js' : 
                        industry === 'electronics' ? 'electronics.js (fallback to generic)' :
                        'generic (fallback to food-ingredients.js)'
  };
}

/**
 * Debug utility: Get list of available industries
 * @returns {string[]} Array of available industry identifiers
 */
function getAvailableIndustries() {
  return Object.keys(INDUSTRY_PATTERNS);
}

/**
 * Utility: Test if a category would match a specific industry
 * @param {string} category - Product category to test
 * @param {string} industryName - Industry to test against
 * @returns {boolean} True if category matches the specified industry
 */
function testCategoryForIndustry(category, industryName) {
  const patterns = INDUSTRY_PATTERNS[industryName];
  if (!patterns) {
    console.error(`Unknown industry: ${industryName}`);
    return false;
  }

  return matchesIndustry(category, patterns);
}

// CommonJS exports
module.exports = {
  detectIndustry,
  getPromptsForCategory,
  getCategoryStats,
  getAvailableIndustries,
  testCategoryForIndustry
};
