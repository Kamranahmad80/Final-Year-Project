import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

const api = axios.create({
    baseURL: isDevelopment
      ? 'http://localhost:5000'  // For local development
      : 'https://final-year-project-kohl-alpha.vercel.app',  // For Vercel deployment
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only log errors in development mode
        if (isDevelopment) {
            if (error.code === 'ECONNABORTED') {
                console.log('API Error: Request timed out');
            } else {
                console.log('API Error:', error.message);
            }
        }
        
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 