import { useState, useEffect } from "react";
import { productService } from "../services/products";

export const useProducts = () => {
  const [state, setState] = useState({
    data: null,
    loading: "idle",
    error: null,
  });

  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    rating: 0,
    sortBy: "name",
  });

  const fetchProducts = async () => {
    setState((prev) => ({ ...prev, loading: "loading", error: null }));

    try {
      const products = await productService.getAllProducts();
      setState({
        data: products,
        loading: "succeeded",
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: "failed",
        error: error.message || "An error occurred",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = state.data
    ? filterAndSortProducts(state.data, filters)
    : [];

  return {
    products: filteredProducts,
    loading: state.loading,
    error: state.error,
    filters,
    setFilters,
    refetch: fetchProducts,
  };
};

export const useProduct = (id) => {
  const [state, setState] = useState({
    data: null,
    loading: "idle",
    error: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setState((prev) => ({ ...prev, loading: "loading", error: null }));

      try {
        const product = await productService.getProductById(id);
        setState({
          data: product,
          loading: "succeeded",
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: "failed",
          error: error.message || "Product not found",
        });
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  return state;
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const filterAndSortProducts = (products, filters) => {
  let filtered = [...products];

  if (filters.category) {
    filtered = filtered.filter(
      (product) =>
        product.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  filtered = filtered.filter(
    (product) =>
      product.price >= filters.minPrice && product.price <= filters.maxPrice
  );

  if (filters.rating > 0) {
    filtered = filtered.filter(
      (product) => product.rating.rate >= filters.rating
    );
  }

  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low":
        return a.price - b.price;

      case "price-high":
        return b.price - a.price;

      case "rating":
        return b.rating.rate - a.rating.rate;

      case "name":
      default:
        return a.title.localeCompare(b.title);
    }
  });

  return filtered;
};
