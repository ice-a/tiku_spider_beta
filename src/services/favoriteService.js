import { apiClient } from './apiClient';

// 本地存储键名
const LOCAL_FAVORITES_KEY = 'tiku_favorites';

/**
 * 收藏服务
 * 根据用户登录状态决定从本地存储或后端获取收藏数据
 */
class FavoriteService {
  /**
   * 判断用户是否已登录
   * @returns {boolean}
   */
  isLoggedIn() {
    return !!localStorage.getItem('authToken');
  }

  /**
   * 获取收藏的题目ID列表
   * @returns {Promise<string[]>} 收藏的题目ID列表
   */
  async getFavoriteIds() {
    if (this.isLoggedIn()) {
      // 已登录用户从后端获取
      try {
        const response = await apiClient.get('/favorites');
        return response.data.data.favoriteIds || [];
      } catch (error) {
        console.error('获取收藏列表失败:', error);
        return [];
      }
    } else {
      // 未登录用户从本地存储获取
      try {
        const favorites = localStorage.getItem(LOCAL_FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
      } catch (error) {
        console.error('解析本地收藏数据失败:', error);
        return [];
      }
    }
  }

  /**
   * 获取收藏的题目列表
   * @returns {Promise<Object[]>} 收藏的题目列表
   */
  async getFavorites() {
    const favoriteIds = await this.getFavoriteIds();
    
    if (favoriteIds.length === 0) {
      return [];
    }
    
    try {
      // 无论是否登录，都通过API获取题目详情
      const response = await apiClient.post('/questions/batch', { ids: favoriteIds });
      return response.data.data.questions || [];
    } catch (error) {
      console.error('获取收藏题目详情失败:', error);
      return [];
    }
  }

  /**
   * 添加收藏
   * @param {string} questionId 题目ID
   * @returns {Promise<boolean>} 是否成功
   */
  async addFavorite(questionId) {
    if (this.isLoggedIn()) {
      // 已登录用户保存到后端
      try {
        await apiClient.post(`/favorites/${questionId}`);
        return true;
      } catch (error) {
        console.error('添加收藏失败:', error);
        return false;
      }
    } else {
      // 未登录用户保存到本地
      try {
        const favorites = await this.getFavoriteIds();
        if (!favorites.includes(questionId)) {
          favorites.push(questionId);
          localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
        }
        return true;
      } catch (error) {
        console.error('保存本地收藏失败:', error);
        return false;
      }
    }
  }

  /**
   * 移除收藏
   * @param {string} questionId 题目ID
   * @returns {Promise<boolean>} 是否成功
   */
  async removeFavorite(questionId) {
    if (this.isLoggedIn()) {
      // 已登录用户从后端移除
      try {
        await apiClient.delete(`/favorites/${questionId}`);
        return true;
      } catch (error) {
        console.error('移除收藏失败:', error);
        return false;
      }
    } else {
      // 未登录用户从本地移除
      try {
        let favorites = await this.getFavoriteIds();
        favorites = favorites.filter(id => id !== questionId);
        localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
        return true;
      } catch (error) {
        console.error('移除本地收藏失败:', error);
        return false;
      }
    }
  }

  /**
   * 检查题目是否已收藏
   * @param {string} questionId 题目ID
   * @returns {Promise<boolean>} 是否已收藏
   */
  async isFavorite(questionId) {
    const favorites = await this.getFavoriteIds();
    return favorites.includes(questionId);
  }

  /**
   * 同步本地收藏到后端
   * 用户登录后调用此方法
   * @returns {Promise<boolean>} 是否成功
   */
  async syncFavoritesToServer() {
    if (!this.isLoggedIn()) {
      return false;
    }
    
    try {
      // 获取本地收藏
      const localFavorites = localStorage.getItem(LOCAL_FAVORITES_KEY);
      if (!localFavorites) {
        return true;
      }
      
      const favoriteIds = JSON.parse(localFavorites);
      if (favoriteIds.length === 0) {
        return true;
      }
      
      // 同步到服务器
      await apiClient.post('/favorites/sync', { favoriteIds });
      
      // 同步成功后清除本地收藏
      localStorage.removeItem(LOCAL_FAVORITES_KEY);
      
      return true;
    } catch (error) {
      console.error('同步收藏失败:', error);
      return false;
    }
  }
}

export default new FavoriteService();