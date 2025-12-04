import axios from 'axios';
import Customers from '../pages/Customers';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.MODE === 'production'
        ? `http://${import.meta.env.VITE_PRODUCTION_DB_HOST}:${import.meta.env.VITE_PRODUCTION_PORT}/rgc/api`
        : '/rgc/api',  // Use relative URL in development to leverage Vite proxy
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor for adding auth token or other headers
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add app name to headers
        config.headers['X-App-Name'] = import.meta.env.VITE_APP_NAME || 'Ribshack POS System';
        config.headers['X-App-Version'] = import.meta.env.VITE_APP_VERSION || '1.0.0';

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common HTTP errors
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized - redirect to login
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Internal server error');
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
        } else if (error.request) {
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

// API endpoints
export const apiEndpoints = {
    // Item Types
    itemTypes: {
        getAll: () => api.get('/item-categories'),
        create: (data) => api.post('/item-categories', data),
        update: (id, data) => api.put(`/item-categories/${id}`, data),
        delete: (id) => api.delete(`/item-categories/${id}`),
    },

    // Items
    items: {
        getAll: () => api.get('/items'),
        getById: (id) => api.get(`/items/${id}`),
        create: (data) => api.post('/items', data),
        update: (id, data) => api.put(`/items/${id}`, data),
        delete: (id) => api.delete(`/items/${id}`),
    },

    // Locations
    locations: {
        getAll: () => api.get('/locations'),
        create: (data) => api.post('/locations', data),
        update: (id, data) => api.put(`/locations/${id}`, data),
        delete: (id) => api.delete(`/locations/${id}`),
    },

    // Orders
    orders: {
        getAll: () => api.get('/orders'),
        getById: (id) => api.get(`/orders/${id}`),
        create: (data) => api.post('/orders', data),
        update: (id, data) => api.put(`/orders/${id}`, data),
        delete: (id) => api.delete(`/orders/${id}`),
        getByDateRange: (from, to) => api.get(`/orders/date-range?from=${from}&to=${to}`),
        getByLocation: (locationId) => api.get(`/orders/location/${locationId}`),
    },

    // Order Items
    orderItems: {
        getAll: () => api.get('/order-items'),
        getByOrderId: (orderId) => api.get(`/order-items/order/${orderId}`),
        create: (data) => api.post('/order-items', data),
        update: (id, data) => api.put(`/order-items/${id}`, data),
        delete: (id) => api.delete(`/order-items/${id}`),
    },

    // Users
    users: {
        getAll: () => api.get('/users'),
        getById: (id) => api.get(`/users/${id}`),
        create: (data) => api.post('/users', data),
        update: (id, data) => api.put(`/users/${id}`, data),
        delete: (id) => api.delete(`/users/${id}`),
        login: (credentials) => api.post('/users/login', credentials),
        logout: () => api.post('/users/logout'),
    },

    customers: {
        getAll: () => api.get('/customers'),
        getById: (id) => api.get(`/customers/${id}`),
        create: (data) => api.post('/customers', data),
        update: (id, data) => api.put(`/customers/${id}`, data),
        delete: (id) => api.delete(`/customers/${id}`),
        login: (credentials) => api.post('/customers/login', credentials),
        logout: () => api.post('/customers/logout'),
    },

    // Roles
    roles: {
        getAll: () => api.get('/roles'),
        create: (data) => api.post('/roles', data),
        update: (id, data) => api.put(`/roles/${id}`, data),
        delete: (id) => api.delete(`/roles/${id}`),
    },

    // Order Types
    orderTypes: {
        getAll: () => api.get('/order-types'),
        create: (data) => api.post('/order-types', data),
        update: (id, data) => api.put(`/order-types/${id}`, data),
        delete: (id) => api.delete(`/order-types/${id}`),
    },

    // Status
    status: {
        getAll: () => api.get('/status'),
        create: (data) => api.post('/status', data),
        update: (id, data) => api.put(`/status/${id}`, data),
        delete: (id) => api.delete(`/status/${id}`),
    },

    // Payment Methods
    paymentMethods: {
        getAll: () => api.get('/payment-methods'),
        create: (data) => api.post('/payment-methods', data),
        update: (id, data) => api.put(`/payment-methods/${id}`, data),
        delete: (id) => api.delete(`/payment-methods/${id}`),
    },

    // Credit Cards
    creditCards: {
        getAll: () => api.get('/card-networks'),
        create: (data) => api.post('/card-networks', data),
        update: (id, data) => api.put(`/card-networks/${id}`, data),
        delete: (id) => api.delete(`/card-networks/${id}`),
    },

    // Tax Config
    taxConfig: {
        getAll: () => api.get('/tax-config'),
        create: (data) => api.post('/tax-config', data),
        update: (id, data) => api.put(`/tax-config/${id}`, data),
        delete: (id) => api.delete(`/tax-config/${id}`),
    },
};

export default api;