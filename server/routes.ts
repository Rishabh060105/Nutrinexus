import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Food search endpoint
  app.get('/api/food/search', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      const { search_terms, categories_tags, page = 1, page_size = 24 } = req.query;
      
      const searchUrl = new URL('https://world.openfoodfacts.org/cgi/search.pl');
      searchUrl.searchParams.append('action', 'process');
      searchUrl.searchParams.append('json', '1');
      searchUrl.searchParams.append('page', page.toString());
      searchUrl.searchParams.append('page_size', page_size.toString());
      searchUrl.searchParams.append('fields', 'code,product_name,brands,images,nutrition_grades,categories_tags,ingredients_text,nutriments');
      
      if (search_terms) {
        searchUrl.searchParams.append('search_terms', search_terms.toString());
        searchUrl.searchParams.append('search_simple', '1');
      }
      
      if (categories_tags) {
        searchUrl.searchParams.append('tagtype_0', 'categories');
        searchUrl.searchParams.append('tag_contains_0', 'contains');
        searchUrl.searchParams.append('tag_0', categories_tags.toString());
      }

      const response = await fetch(searchUrl.toString(), {
        headers: {
          'User-Agent': 'FoodExplorer/1.0 (food-explorer@example.com)',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Food search API error:', error);
      res.status(500).json({ error: 'Failed to fetch products', message: error.message });
    }
  });

  // Product details endpoint
  app.get('/api/food/product/:barcode', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      const { barcode } = req.params;
      
      const productUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

      const response = await fetch(productUrl, {
        headers: {
          'User-Agent': 'FoodExplorer/1.0 (food-explorer@example.com)',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Product API error:', error);
      res.status(500).json({ error: 'Failed to fetch product', message: error.message });
    }
  });

  // Categories endpoint
  app.get('/api/food/categories', async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      
      const categories = [
        'beverages',
        'dairy',
        'snacks', 
        'chocolate',
        'cereals',
        'bread',
        'fruits',
        'vegetables',
        'meat',
        'fish',
        'cookies',
        'yogurts',
        'ice-cream',
        'pasta',
        'cheese',
        'cakes',
        'soups',
        'coffee',
        'tea',
        'candies'
      ];

      res.json({ categories });
    } catch (error: any) {
      console.error('Categories API error:', error);
      res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
