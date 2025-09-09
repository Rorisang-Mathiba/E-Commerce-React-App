import { apiService } from "./api";

export const authService = {
    login: async (credentials) => {
        try {
            const response = await apiService.post('/auth/login', credentials);

            const userData = {
                id: 1,
                email: credentials.email,
                firstName: 'Jane',
                lastName: 'Doe',
                token: 'demo-token-' + Date.now(),
            };

            localStorage.setItem('e-commerce-token', userData.token);
            localStorage.setItem('e-commerce-user', JSON.stringify(userData));

            return userData;
        } catch (error) {
            throw new Error('Invalid credentials');
        }
    },

    register: async (data) => {
        try {
            // Mock registration - in real app this would call actual API
            if (data.password  !== data.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const userData = {
                id: Date.now(),
                email: data.firstName,
                lastName: data.lastName,
                token: 'demo-token-' + Date.now(),
            };

            localStorage.setItem('e-commerce-token', userData.token);
            localStorage.setItem('e-commerce-user', JSON.stringify(userData));

            return userData;

        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    },

    logout: ()  => {
        localStorage.removeItem('e-commerce-token');
        localStorage.removeItem('e-commerce-user');
    },

    getCurrentUser: ()  => {
        try {
            const userData = localStorage.getItem('e-commerce-user');
            return userData ? JSON.parse(userData) : null;

        } catch (error) {
            console error('Error parsing user data:', error);
            return null;
        }
    },

    isAuthenticated: ()  => {
        return !!localStorage.getItem('e-commerce-token');
    },
};