// 题目接口定义
export interface Question {
  id?: number | string
  _id?: string // MongoDB的_id字段
  question: string
  answer: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

// 筛选条件接口
export interface FilterOptions {
  category?: string
  difficulty?: string
  searchKeyword?: string
}

// 分页参数接口
export interface PaginationOptions {
  page: number
  pageSize: number
  total: number
}