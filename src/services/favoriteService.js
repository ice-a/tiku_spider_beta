import { apiClient } from './apiClient';
import { 
  getFavoriteIds as getLocalFavoriteIds,
  addToFavorites as addFavoriteToLocal,
  removeFromFavorites as removeFavoriteFromLocal,
  isFavorite as isFavoriteLocal
} from './storageService';

/**
 * 收藏服务 - 仅使用本地存储
 */
class FavoriteService {
  /**
   * 获取收藏的题目ID列表
   * @returns {Promise<string[]>} 收藏的题目ID列表
   */
  async getFavoriteIds() {
    return getLocalFavoriteIds();
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
      // 通过API获取题目详情
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
    try {
      addFavoriteToLocal(questionId);
      return true;
    } catch (error) {
      console.error('保存本地收藏失败:', error);
      return false;
    }
  }

  /**
   * 移除收藏
   * @param {string} questionId 题目ID
   * @returns {Promise<boolean>} 是否成功
   */
  async removeFavorite(questionId) {
    try {
      removeFavoriteFromLocal(questionId);
      return true;
    } catch (error) {
      console.error('移除本地收藏失败:', error);
      return false;
    }
  }

  /**
   * 检查题目是否已收藏
   * @param {string} questionId 题目ID
   * @returns {Promise<boolean>} 是否已收藏
   */
  async isFavorite(questionId) {
    return isFavoriteLocal(questionId);
  }
}

export default new FavoriteService();