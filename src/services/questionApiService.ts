import { apiClient, type ApiResponse, type PaginatedResponse } from './apiService'
import type { Question, FilterOptions, PaginationOptions } from '../types'

// 题目API服务
export class QuestionApiService {
  // 获取题目列表
  static async getQuestions(
    filters: FilterOptions = {},
    pagination: PaginationOptions = { page: 1, pageSize: 20, total: 0 }
  ): Promise<{ questions: Question[], total: number }> {
    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        category: filters.category,
        difficulty: filters.difficulty,
        search: filters.searchKeyword
      }

      const response = await apiClient.get<PaginatedResponse<Question>>('/questions', params)
      
      if (response.success) {
        return {
          questions: response.data.questions.map(q => ({ ...q, id: q._id })),
          total: response.data.pagination.total
        }
      } else {
        throw new Error(response.message || '获取题目列表失败')
      }
    } catch (error) {
      console.error('获取题目列表失败:', error)
      throw error
    }
  }

  // 根据ID获取题目详情
  static async getQuestionById(id: string): Promise<Question> {
    try {
      const response = await apiClient.get<Question>(`/questions/${id}`)
      
      if (response.success) {
        return { ...response.data, id: response.data._id }
      } else {
        throw new Error(response.message || '获取题目详情失败')
      }
    } catch (error) {
      console.error('获取题目详情失败:', error)
      throw error
    }
  }

  // 搜索题目
  static async searchQuestions(
    keyword: string,
    pagination: PaginationOptions = { page: 1, pageSize: 20, total: 0 }
  ): Promise<{ questions: Question[], total: number }> {
    try {
      const params = {
        q: keyword,
        page: pagination.page,
        pageSize: pagination.pageSize
      }

      const response = await apiClient.get<PaginatedResponse<Question>>('/questions/search', params)
      
      if (response.success) {
        return {
          questions: response.data.questions.map(q => ({ ...q, id: q._id })),
          total: response.data.pagination.total
        }
      } else {
        throw new Error(response.message || '搜索题目失败')
      }
    } catch (error) {
      console.error('搜索题目失败:', error)
      throw error
    }
  }

  // 获取分类列表
  static async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/questions/categories')
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || '获取分类列表失败')
      }
    } catch (error) {
      console.error('获取分类列表失败:', error)
      return []
    }
  }

  // 获取统计信息
  static async getStats(): Promise<any> {
    try {
      const response = await apiClient.get<any>('/questions/stats')
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || '获取统计信息失败')
      }
    } catch (error) {
      console.error('获取统计信息失败:', error)
      return null
    }
  }
}