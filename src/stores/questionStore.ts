import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { QuestionApiService } from '../services/questionApiService'
import type { Question, FilterOptions, PaginationOptions } from '../types'

export const useQuestionStore = defineStore('question', () => {
  // 状态
  const questions = ref<Question[]>([])
  const currentQuestion = ref<Question | null>(null)
  const categories = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 分页状态
  const pagination = ref<PaginationOptions>({
    page: 1,
    pageSize: 20,
    total: 0
  })
  
  // 筛选状态
  const filters = ref<FilterOptions>({
    category: undefined,
    difficulty: undefined,
    searchKeyword: undefined
  })

  // 缓存状态
  const questionsCache = ref<Map<string, Question[]>>(new Map())
  const questionDetailCache = ref<Map<string, Question>>(new Map())

  // 计算属性
  const totalPages = computed(() => 
    Math.ceil(pagination.value.total / pagination.value.pageSize)
  )

  const hasNextPage = computed(() => 
    pagination.value.page < totalPages.value
  )

  const hasPrevPage = computed(() => 
    pagination.value.page > 1
  )

  // 生成缓存键
  const generateCacheKey = (filters: FilterOptions, page: number, pageSize: number) => {
    return JSON.stringify({ filters, page, pageSize })
  }

  // 加载题目列表
  const loadQuestions = async (forceRefresh = false) => {
    const cacheKey = generateCacheKey(filters.value, pagination.value.page, pagination.value.pageSize)
    
    // 检查缓存
    if (!forceRefresh && questionsCache.value.has(cacheKey)) {
      questions.value = questionsCache.value.get(cacheKey)!
      return
    }

    loading.value = true
    error.value = null
    
    try {
      const result = await QuestionApiService.getQuestions(filters.value, pagination.value)
      
      questions.value = result.questions
      pagination.value.total = result.total
      
      // 缓存结果
      questionsCache.value.set(cacheKey, result.questions)
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载题目失败'
      console.error('加载题目失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 加载题目详情
  const loadQuestionDetail = async (id: string, forceRefresh = false) => {
    // 检查缓存
    if (!forceRefresh && questionDetailCache.value.has(id)) {
      currentQuestion.value = questionDetailCache.value.get(id)!
      return currentQuestion.value
    }

    loading.value = true
    error.value = null
    
    try {
      const question = await QuestionApiService.getQuestionById(id)
      
      currentQuestion.value = question
      
      // 缓存结果
      questionDetailCache.value.set(id, question)
      
      return question
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载题目详情失败'
      console.error('加载题目详情失败:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // 搜索题目
  const searchQuestions = async (keyword: string) => {
    if (!keyword.trim()) {
      return
    }

    loading.value = true
    error.value = null
    
    try {
      const result = await QuestionApiService.searchQuestions(keyword, pagination.value)
      
      questions.value = result.questions
      pagination.value.total = result.total
      
      // 更新筛选条件
      filters.value.searchKeyword = keyword
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : '搜索题目失败'
      console.error('搜索题目失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 加载分类列表
  const loadCategories = async () => {
    try {
      categories.value = await QuestionApiService.getCategories()
    } catch (err) {
      console.error('加载分类失败:', err)
    }
  }

  // 设置筛选条件
  const setFilters = (newFilters: Partial<FilterOptions>) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // 重置到第一页
  }

  // 设置分页
  const setPagination = (newPagination: Partial<PaginationOptions>) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  // 重置筛选条件
  const resetFilters = () => {
    filters.value = {
      category: undefined,
      difficulty: undefined,
      searchKeyword: undefined
    }
    pagination.value.page = 1
  }

  // 清除缓存
  const clearCache = () => {
    questionsCache.value.clear()
    questionDetailCache.value.clear()
  }

  // 获取相邻题目ID
  const getAdjacentQuestionIds = (currentId: string) => {
    const currentIndex = questions.value.findIndex(q => q.id === currentId)
    
    return {
      prevId: currentIndex > 0 ? questions.value[currentIndex - 1].id : null,
      nextId: currentIndex >= 0 && currentIndex < questions.value.length - 1 
        ? questions.value[currentIndex + 1].id : null
    }
  }

  return {
    // 状态
    questions,
    currentQuestion,
    categories,
    loading,
    error,
    pagination,
    filters,
    
    // 缓存状态 - 暴露给组件使用
    questionsCache,
    questionDetailCache,
    
    // 计算属性
    totalPages,
    hasNextPage,
    hasPrevPage,
    
    // 方法
    loadQuestions,
    loadQuestionDetail,
    searchQuestions,
    loadCategories,
    setFilters,
    setPagination,
    resetFilters,
    clearCache,
    getAdjacentQuestionIds,
    
    // 缓存辅助方法
    generateCacheKey
  }
})