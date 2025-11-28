// Environment configuration utility
export const config = {
  // Get current environment
  environment: import.meta.env.MODE || import.meta.env.VITE_ENVIRONMENT || 'development',
  
  // Database configuration
  database: {
    host: import.meta.env.MODE === 'production' 
      ? import.meta.env.VITE_PRODUCTION_DB_HOST 
      : import.meta.env.VITE_DEVELOPMENT_DB_HOST || 'localhost',
    port: import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_PRODUCTION_DB_PORT
      : import.meta.env.VITE_DEVELOPMENT_DB_PORT || 5432,
    name: import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_PRODUCTION_DB_NAME
      : import.meta.env.VITE_DEVELOPMENT_DB_NAME || 'rgc_db',
    user: import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_PRODUCTION_DB_USER
      : import.meta.env.VITE_DEVELOPMENT_DB_USER || 'stephenbellocillo',
    password: import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_PRODUCTION_DB_PASSWORD
      : import.meta.env.VITE_DEVELOPMENT_DB_PASSWORD || '',
  },
  
  // Server configuration
  server: {
    port: import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_PRODUCTION_PORT
      : import.meta.env.VITE_DEVELOPMENT_PORT || 3000,
    host: import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_PRODUCTION_DB_HOST
      : import.meta.env.VITE_DEVELOPMENT_DB_HOST || 'localhost',
  },
  
  // Application settings
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Ribshack POS System',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  
  // API configuration
  api: {
    baseURL: import.meta.env.MODE === 'production'
      ? `http://${import.meta.env.VITE_PRODUCTION_DB_HOST}:${import.meta.env.VITE_PRODUCTION_PORT}`
      : `http://${import.meta.env.VITE_DEVELOPMENT_DB_HOST || 'localhost'}:${import.meta.env.VITE_DEVELOPMENT_PORT || 3000}`,
    timeout: 10000,
  },
  
  // Helper methods
  isDevelopment: () => config.environment === 'development',
  isProduction: () => config.environment === 'production',
  
  // Get database connection string
  getDatabaseUrl: () => {
    const { host, port, name, user, password } = config.database;
    return `postgresql://${user}:${password}@${host}:${port}/${name}`;
  },
  
  // Get API URL
  getApiUrl: (endpoint = '') => {
    return `${config.api.baseURL}/rgc/api${endpoint}`;
  },
};

export default config;