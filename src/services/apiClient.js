import axios from 'axios';

// 从环境变量获取API基础URL，与apiService.ts保持一致
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 简单处理错误
    if (error.response) {
      console.error(`Error: ${error.message}, Status: ${error.response.status}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };