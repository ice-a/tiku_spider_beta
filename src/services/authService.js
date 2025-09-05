import { apiClient } from './apiClient.js';

/**
 * 认证服务
 */
export class AuthService {
  /**
   * 用户注册
   * @param {Object} userData - 用户注册数据
   * @returns {Promise<Object>}
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '注册失败');
    }
  }

  /**
   * 用户登录
   * @param {Object} credentials - 登录凭据
   * @returns {Promise<Object>}
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      // 保存token到localStorage
      if (response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '登录失败');
    }
  }

  /**
   * 用户登出
   */
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await apiClient.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data.data;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  /**
   * 获取认证令牌
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('auth_token');
  }

  /**
   * 检查用户是否已登录
   * @returns {boolean}
   */
  isLoggedIn() {
    return !!this.getToken();
  }

  /**
   * 刷新令牌
   * @returns {Promise<string>}
   */
  async refreshToken() {
    try {
      const token = this.getToken();
      const response = await apiClient.post('/auth/refresh', { token });
      
      if (response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        return response.data.data.token;
      }

      return token;
    } catch (error) {
      this.logout();
      throw new Error('令牌刷新失败');
    }
  }

  /**
   * 验证验证码
   * @param {Object} captchaData - 验证码数据
   * @returns {Promise<Object>}
   */
  async verifyCaptcha(captchaData) {
    try {
      const response = await apiClient.post('/auth/captcha', captchaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || '验证码验证失败');
    }
  }

  /**
   * 检查是否需要验证码
   * @param {string} username - 用户名
   * @returns {Promise<boolean>}
   */
  async needsCaptcha(username) {
    try {
      // 这里可以调用后端API检查是否需要验证码
      // 暂时返回false，实际应该根据后端响应决定
      return false;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();