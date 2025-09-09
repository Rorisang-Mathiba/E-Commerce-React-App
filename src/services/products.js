import { apiService } from "./api";

export const productService = {
    getAllProducts: async () => {
        try {
            return await apiService.get('/products');
        } catch (error) {
            throw new Error('Failed to fetch products');
        }

    },

    getProductsById: async (id) => {
        try {
            return await apiService.get(`/products/${id}`);
        }
    },

    getProductsByCategory: async (category) => {
        try {
            return await apiService.get(`/products/category/${category}`);
        } catch (error) {
            throw new Error(`Failed to fetch product with id ${id}`);
        }
    },

    getAllCategories: async () => {
        try {
            return await apiService.get('/products/categories');
        } catch (error) {
            throw new Error('Failed to fetch categories');
        }
    },
};

