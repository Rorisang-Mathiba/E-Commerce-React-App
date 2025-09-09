import axios from "axios";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || "https://fakestoreapi.com",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const tasken = localStorage.getItem("e-commerce-react-app-token");
        if (token) {
          config.headers.Authorisation = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    //Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("e-commerce-react-app-token");
          localStorage.removeItem("e-commerce-react-app-token");
          window.location.href = "/login";
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async get(url) {
    const response = await this.api.get(url);
    return response.data;
  }

  async post(url, data) {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async delete(url) {
    const response = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService();
