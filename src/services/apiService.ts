// API服务配置 - 支持环境变量
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api'

// 调试信息
console.log('API_BASE_URL:', API_BASE_URL)
console.log('VITE_API_URL:', (import.meta as any).env?.VITE_API_URL)
console.log('NODE_ENV:', (import.meta as any).env?.NODE_ENV)

// API响应接口
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// 分页响应接口
interface PaginatedResponse<T> {
  questions: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// HTTP请求封装
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    // 获取认证令牌
    const token = localStorage.getItem('auth_token')
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('API请求失败:', error)
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint
    
    if (params) {
      const searchParams = new URLSearchParams()
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, String(params[key]))
        }
      })
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`
      }
    }
    
    return this.request<T>(url)
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// 创建API客户端实例
const apiClient = new ApiClient(API_BASE_URL)

export { apiClient, type ApiResponse, type PaginatedResponse }