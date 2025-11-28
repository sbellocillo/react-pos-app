// Application configuration constants
export const APP_CONFIG = {
  name: 'RIBSHACK POS',
  version: '1.0.0',
  description: 'Point of Sale System for Restaurant Management',
  author: 'RibShack Team',
  repository: 'https://github.com/ribshack/pos-system'
};

// POS System Menu Items
export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', route: '/dashboard' },
  { id: 'items', label: 'Items', icon: '🛍️', route: '/items' },
  { id: 'itemTypes', label: 'Item Types', icon: '📋', route: '/item-types' },
  { id: 'locations', label: 'Locations', icon: '📍', route: '/locations' },
  { id: 'orders', label: 'Orders', icon: '📝', route: '/orders' },
  { id: 'orderItems', label: 'Order Items', icon: '🛒', route: '/order-items' },
  { id: 'orderTypes', label: 'Order Types', icon: '📄', route: '/order-types' },
  { id: 'paymentMethods', label: 'Payment Methods', icon: '💳', route: '/payment-methods' },
  { id: 'roles', label: 'Roles', icon: '👥', route: '/roles' },
  { id: 'status', label: 'Status', icon: '⚡', route: '/status' },
  { id: 'users', label: 'Users', icon: '👤', route: '/users' },
  { id: 'taxConfig', label: 'Tax Config', icon: '🧾', route: '/tax-config' }
];

// API endpoints for POS system
export const API_ENDPOINTS = {
  // Authentication
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
  
  // Core entities
  items: '/api/items',
  itemTypes: '/api/item-types',
  locations: '/api/locations',
  orders: '/api/orders',
  orderItems: '/api/order-items',
  orderTypes: '/api/order-types',
  paymentMethods: '/api/payment-methods',
  roles: '/api/roles',
  status: '/api/status',
  users: '/api/users',
  taxConfig: '/api/tax-config',
  
  // Reports and analytics
  reports: '/api/reports',
  analytics: '/api/analytics'
};

// Local storage keys
export const STORAGE_KEYS = {
  todos: 'practice-todos',
  preferences: 'user-preferences',
  goals: 'user-goals',
  tasks: 'user-tasks'
};

// UI constants
export const UI_CONSTANTS = {
  maxTodosPerPage: 10,
  animationDuration: 300,
  debounceDelay: 500,
  toastDuration: 3000
};

// Theme configuration
export const THEMES = {
  light: {
    primary: '#4f46e5',
    secondary: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b'
  },
  dark: {
    primary: '#6366f1',
    secondary: '#22d3ee',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9'
  }
};

// Validation rules
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 8,
    message: 'Password must be at least 8 characters long'
  },
  name: {
    minLength: 2,
    message: 'Name must be at least 2 characters long'
  }
};

// Progress categories
export const PROGRESS_CATEGORIES = {
  EDUCATION: 'education',
  HEALTH: 'health',
  PERSONAL: 'personal',
  WORK: 'work',
  FINANCE: 'finance',
  HOBBY: 'hobby'
};

// Task priorities
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Color mappings for categories and priorities
export const COLOR_MAPPINGS = {
  categories: {
    education: '#4f46e5',
    health: '#10b981',
    personal: '#f59e0b',
    work: '#ef4444',
    finance: '#8b5cf6',
    hobby: '#06b6d4'
  },
  priorities: {
    low: '#6b7280',
    medium: '#f59e0b',
    high: '#ef4444',
    urgent: '#dc2626'
  }
};