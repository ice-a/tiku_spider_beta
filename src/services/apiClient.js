import axios from 'axios';
import { getRequestHeaders } from '../utils/signUtils';
// 从环境变量获取API基础URL，与apiService.ts保持一致
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001/api';

// 游客访问计数器
let guestRequestCount = 0;
const GUEST_REQUEST_LIMIT = 200;

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器 - 添加认证token和签名
apiClient.interceptors.request.use(
  (config) => {
    // 获取认证token
    const token = localStorage.getItem('authToken');
    const isLoggedIn = !!token;
    
    // 游客访问限制
    if (!isLoggedIn) {
      guestRequestCount++;
      if (guestRequestCount > GUEST_REQUEST_LIMIT) {
        return Promise.reject(new Error('游客访问次数已达上限，请登录后继续使用'));
      }
    }
    
    // 添加认证token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 提取请求参数
    const params = config.params || {};
    const data = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
    const combinedParams = { ...params, ...data };
    
    // 添加签名和时间戳
    const signHeaders = getRequestHeaders(combinedParams);
    config.headers = {
      ...config.headers,
      ...signHeaders
    };
    
    // 添加用户类型标识
    config.headers['X-User-Type'] = isLoggedIn ? 'registered' : 'guest';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理不同类型的错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // token过期或无效，清除本地存储并重定向到登录页
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // 签名验证失败或权限不足
          console.error('签名验证失败或权限不足');
          break;
        case 429:
          // 请求次数超限
          console.error('请求次数超限，请稍后再试');
          break;
      }
    } else if (error.message === '游客访问次数已达上限，请登录后继续使用') {
      // 游客访问次数限制
      alert('您的访问次数已达上限，请登录后继续使用');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };