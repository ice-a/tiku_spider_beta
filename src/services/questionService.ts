import type { Question, FilterOptions, PaginationOptions } from '../types'

// 模拟从JSON文件加载数据
let questionsData: Question[] = []

// 数据文件配置
const dataFiles = [
  { file: '初级爬虫.json', category: '爬虫基础', difficulty: 'easy' as const },
  { file: '中级爬虫.json', category: '爬虫进阶', difficulty: 'medium' as const },
  { file: '高级爬虫.json', category: '爬虫高级', difficulty: 'hard' as const },
  { file: '中级反爬.json', category: '反爬虫', difficulty: 'medium' as const },
  { file: '高级反爬.json', category: '反爬虫高级', difficulty: 'hard' as const },
  { file: '高级逆向.json', category: '逆向工程', difficulty: 'hard' as const }
]

// 加载数据的函数
export async function loadQuestionsData(): Promise<Question[]> {
  try {
    questionsData = []
    let currentId = 1
    
    // 加载所有数据文件
    for (const fileConfig of dataFiles) {
      try {
        const response = await fetch(`/data/${fileConfig.file}`)
        if (!response.ok) {
          console.warn(`无法加载文件: ${fileConfig.file}`)
          continue
        }
        
        const rawData = await response.json()
        
        // 处理数据，添加ID和分类信息
        const processedData = rawData.map((item: any) => ({
          id: currentId++,
          question: item.question,
          answer: item.answer,
          category: fileConfig.category,
          difficulty: fileConfig.difficulty,
          tags: extractTags(item.question)
        }))
        
        questionsData.push(...processedData)
        console.log(`成功加载 ${fileConfig.file}: ${processedData.length} 道题目`)
      } catch (fileError) {
        console.warn(`加载文件 ${fileConfig.file} 失败:`, fileError)
      }
    }
    
    console.log(`总共加载了 ${questionsData.length} 道题目`)
    return questionsData
  } catch (error) {
    console.error('加载题目数据失败:', error)
    return []
  }
}

// 从问题中提取标签的辅助函数
function extractTags(question: string): string[] {
  const tags: string[] = []
  
  // 技术相关标签
  if (question.includes('JavaScript') || question.includes('JS')) tags.push('JavaScript')
  if (question.includes('Python')) tags.push('Python')
  if (question.includes('Selenium')) tags.push('Selenium')
  if (question.includes('requests')) tags.push('Requests')
  if (question.includes('BeautifulSoup') || question.includes('bs4')) tags.push('BeautifulSoup')
  if (question.includes('Scrapy')) tags.push('Scrapy')
  
  // 反爬相关标签
  if (question.includes('Canvas')) tags.push('Canvas')
  if (question.includes('User-Agent')) tags.push('User-Agent')
  if (question.includes('字体') || question.includes('加密')) tags.push('字体加密')
  if (question.includes('验证码') || question.includes('CAPTCHA')) tags.push('验证码')
  if (question.includes('代理') || question.includes('IP')) tags.push('代理')
  if (question.includes('Cookie') || question.includes('Session')) tags.push('会话管理')
  if (question.includes('Header') || question.includes('请求头')) tags.push('请求头')
  
  // 逆向相关标签
  if (question.includes('逆向') || question.includes('破解')) tags.push('逆向分析')
  if (question.includes('加密') || question.includes('解密')) tags.push('加密解密')
  if (question.includes('混淆')) tags.push('代码混淆')
  if (question.includes('AST')) tags.push('AST')
  
  // 通用标签
  if (question.includes('前端') || question.includes('浏览器')) tags.push('前端')
  if (question.includes('网络') || question.includes('HTTP')) tags.push('网络协议')
  if (question.includes('数据库')) tags.push('数据库')
  if (question.includes('正则') || question.includes('regex')) tags.push('正则表达式')
  
  return tags
}

// 获取所有题目
export function getAllQuestions(): Question[] {
  return questionsData
}

// 根据筛选条件获取题目
export function getFilteredQuestions(filters: FilterOptions): Question[] {
  let filtered = questionsData

  // 按分类筛选
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(q => q.category === filters.category)
  }

  // 按难度筛选
  if (filters.difficulty && filters.difficulty !== 'all') {
    filtered = filtered.filter(q => q.difficulty === filters.difficulty)
  }

  // 按关键词搜索
  if (filters.searchKeyword) {
    const keyword = filters.searchKeyword.toLowerCase()
    filtered = filtered.filter(q => 
      q.question.toLowerCase().includes(keyword) ||
      q.answer.toLowerCase().includes(keyword) ||
      q.tags?.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  return filtered
}

// 分页获取题目
export function getPaginatedQuestions(
  filters: FilterOptions,
  pagination: PaginationOptions
): { questions: Question[], total: number } {
  const filtered = getFilteredQuestions(filters)
  const total = filtered.length
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  const questions = filtered.slice(start, end)

  return { questions, total }
}

// 根据ID获取单个题目
export function getQuestionById(id: number): Question | undefined {
  return questionsData.find(q => q.id === id)
}

// 获取所有分类
export function getCategories(): string[] {
  const categories = [...new Set(questionsData.map(q => q.category).filter(Boolean))]
  return categories
}

// 获取所有难度级别
export function getDifficulties(): Array<{value: string, label: string}> {
  return [
    { value: 'easy', label: '简单' },
    { value: 'medium', label: '中等' },
    { value: 'hard', label: '困难' }
  ]
}