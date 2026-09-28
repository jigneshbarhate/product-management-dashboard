const BASE_URL = 'https://dummyjson.com/products';

/**
 * Service layer for interacting with DummyJSON Products API.
 */
export const productService = {
  /**
   * Fetches all products from the API.
   * Uses limit=100 to retrieve a rich dataset for client-side pagination.
   * @returns {Promise<Array>} List of products
   */
  async getProducts() {
    try {
      const response = await fetch(`${BASE_URL}?limit=100`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Fetches a single product by ID.
   * @param {string|number} id 
   * @returns {Promise<Object>} Product details object
   */
  async getProductById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found.');
        }
        throw new Error(`Failed to fetch product details: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetches product categories list from API.
   * Fallback if API changes structure.
   * @returns {Promise<Array<string>>} Category names
   */
  async getCategories() {
    try {
      const response = await fetch(`${BASE_URL}/category-list`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      const categories = await response.json();
      return Array.isArray(categories) ? categories : [];
    } catch (error) {
      console.warn('Category fetch error, fallback to product dynamic categories:', error);
      return [];
    }
  },

  /**
   * Sends a POST request to add a new product.
   * @param {Object} productData 
   * @returns {Promise<Object>} Created product object
   */
  async addProduct(productData) {
    try {
      const response = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: productData.title,
          description: productData.description,
          category: productData.category,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock, 10),
          brand: productData.brand,
          thumbnail: productData.thumbnail,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.status} ${response.statusText}`);
      }

      const createdProduct = await response.json();
      return createdProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
};

export default productService;
