const axios = require('axios');

class TavilySearchTool {
  constructor() {
    this.apiKey = process.env.TAVILY_API_KEY;
    this.baseUrl = 'https://api.tavily.com/search';
    
    if (!this.apiKey) {
      console.warn('TAVILY_API_KEY not found in environment variables');
    }
  }

  /**
   * Search for information using Tavily API
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} - Search results
   */
  async search(query, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('Tavily API key is required');
      }

      const searchOptions = {
        api_key: this.apiKey,
        query: query,
        search_depth: options.searchDepth || 'basic',
        include_images: options.includeImages || false,
        include_answer: options.includeAnswer || true,
        max_results: options.maxResults || 5,
        include_domains: options.includeDomains || [],
        exclude_domains: options.excludeDomains || []
      };

      const response = await axios.post(this.baseUrl, searchOptions, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return this.formatResults(response.data);
    } catch (error) {
      console.error('Tavily search error:', error.message);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Format search results for the chatbot
   * @param {Object} rawResults - Raw Tavily API response
   * @returns {Object} - Formatted results
   */
  formatResults(rawResults) {
    const results = {
      answer: rawResults.answer || '',
      sources: []
    };

    if (rawResults.results && Array.isArray(rawResults.results)) {
      results.sources = rawResults.results.map(result => ({
        title: result.title,
        url: result.url,
        content: result.content,
        score: result.score || 0
      }));
    }

    return results;
  }

  /**
   * Search specifically for mental health information
   * @param {string} query - The search query
   * @returns {Promise<string>} - Formatted search results as text
   */
  async searchMentalHealth(query) {
    try {
      const enhancedQuery = `mental health ${query}`;
      const results = await this.search(enhancedQuery, {
        maxResults: 3,
        searchDepth: 'advanced',
        includeAnswer: true,
        includeDomains: [
          'mayoclinic.org',
          'psychologytoday.com',
          'nami.org',
          'nimh.nih.gov',
          'who.int',
          'webmd.com',
          'healthline.com'
        ]
      });

      // Format results for LLM consumption
      let formattedResult = '';
      
      if (results.answer) {
        formattedResult += `Direct Answer: ${results.answer}\n\n`;
      }

      if (results.sources && results.sources.length > 0) {
        formattedResult += 'Additional Sources:\n';
        results.sources.forEach((source, index) => {
          formattedResult += `${index + 1}. ${source.title}\n`;
          formattedResult += `   ${source.content.substring(0, 200)}...\n`;
          formattedResult += `   Source: ${source.url}\n\n`;
        });
      }

      return formattedResult || 'No relevant information found.';
    } catch (error) {
      console.error('Mental health search error:', error.message);
      return `Search temporarily unavailable: ${error.message}`;
    }
  }
}

module.exports = TavilySearchTool;