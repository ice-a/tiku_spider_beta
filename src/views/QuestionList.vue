<template>
  <div class="question-list-container">
    <!-- 公告弹窗 -->
    <AnnouncementModal />
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="title">在线题库系统</h1>
          <div class="header-actions">
            <div class="search-box">
              <Input
                v-model="searchKeyword"
                placeholder="搜索题目内容..."
                clearable
                @change="handleSearch"
              >
                <template #prefix-icon>
                  <SearchIcon />
                </template>
              </Input>
            </div>
            <div class="nav-buttons">
              <Button @click="goToFavorites" variant="outline" class="nav-button">
                <template #icon>
                  <HeartIcon />
                </template>
                我的收藏
                <Badge v-if="favoriteCount > 0" :count="favoriteCount" />
              </Button>
              <Button @click="goToAbout" variant="outline" theme="default" class="nav-button">
                <template #icon>
                  <InfoCircleIcon />
                </template>
                关于
              </Button>
              <div v-if="!isLoggedIn" class="auth-buttons">
                <Button @click="goToLogin" variant="text" theme="primary" class="nav-button">
                  登录
                </Button>
                <Button @click="goToRegister" variant="outline" theme="primary" class="nav-button">
                  注册
                </Button>
              </div>
              <div v-else class="user-info">
                <Button variant="text" theme="primary" class="nav-button">
                  {{ userInfo?.username }}
                </Button>
                <Button @click="handleLogout" variant="outline" theme="default" class="nav-button">
                  退出
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 筛选工具栏 -->
    <div class="filter-bar">
      <div class="container">
        <div class="filter-content">
          <div class="filter-item">
            <label>分类：</label>
            <Select
              v-model="selectedCategory"
              placeholder="选择分类"
              @change="handleFilter"
            >
              <Option value="all" label="全部分类" />
              <Option
                v-for="category in categories"
                :key="category"
                :value="category"
                :label="category"
              />
            </Select>
          </div>
          
          <div class="filter-item">
            <label>难度：</label>
            <Select
              v-model="selectedDifficulty"
              placeholder="选择难度"
              @change="handleFilter"
            >
              <Option value="all" label="全部难度" />
              <Option
                v-for="difficulty in difficulties"
                :key="difficulty.value"
                :value="difficulty.value"
                :label="difficulty.label"
              />
            </Select>
          </div>

          <Button @click="resetFilters" variant="outline">
            <template #icon>
              <RefreshIcon />
            </template>
            重置
          </Button>
        </div>
      </div>
    </div>

    <!-- 题目列表 -->
    <main class="main-content">
      <div class="container">
        <div v-if="loading" class="loading-container">
          <Loading size="large" text="加载中..." />
        </div>
        
        <div v-else-if="questions.length === 0" class="empty-container">
          <Empty description="暂无题目数据" />
          <div style="margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <h3>调试信息:</h3>
            <p>Loading: {{ loading }}</p>
            <p>Questions length: {{ questions.length }}</p>
            <p>Categories length: {{ categories.length }}</p>
            <p>Total: {{ total }}</p>
            <p>Error: {{ error }}</p>
          </div>
        </div>
        
        <div v-else class="questions-grid">
          <Card
            v-for="question in questions"
            :key="question.id"
            class="question-card"
            hover
            @click="goToDetail(question.id!)"
          >
            <div class="question-header">
              <div class="question-meta">
                <Tag theme="primary" variant="light">{{ question.category }}</Tag>
                <Tag 
                  :theme="getDifficultyTheme(question.difficulty!)"
                  variant="light"
                >
                  {{ getDifficultyLabel(question.difficulty!) }}
                </Tag>
                <Tag 
                  v-if="isFavoriteQuestion(question.id!)"
                  theme="warning" 
                  variant="light"
                  class="favorite-tag"
                >
                  <template #icon>
                    <HeartIcon />
                  </template>
                  已收藏
                </Tag>
              </div>
              <div class="question-id">#{{ question.id }}</div>
            </div>
            
            <div class="question-content">
              <h3 class="question-title">{{ truncateText(question.question, 100) }}</h3>
              <p class="question-preview">{{ truncateText(question.answer, 150) }}</p>
            </div>
            
            <div class="question-footer">
              <div class="tags">
                <Tag
                  v-for="tag in question.tags?.slice(0, 3)"
                  :key="tag"
                  size="small"
                  variant="outline"
                >
                  {{ tag }}
                </Tag>
              </div>
              <Button size="small" theme="primary" variant="text">
                查看详情
                <template #suffix>
                  <ChevronRightIcon />
                </template>
              </Button>
            </div>
          </Card>
        </div>

        <!-- 分页组件 -->
        <div v-if="!loading && questions.length > 0" class="pagination-container">
          <Pagination
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="total"
            :show-sizer="true"
            :page-size-options="[10, 20, 50, 100]"
            @change="handlePageChange"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Input,
  Select,
  Option,
  Button,
  Card,
  Tag,
  Loading,
  Empty,
  Pagination,
  Badge
} from 'tdesign-vue-next'
import AnnouncementModal from '../components/AnnouncementModal.vue'
import {
  SearchIcon,
  RefreshIcon,
  ChevronRightIcon,
  HeartIcon,
  InfoCircleIcon,
  CloseCircleIcon
} from 'tdesign-icons-vue-next'
import { useQuestionStore } from '../stores/questionStore'
import {
  isFavorite,
  getFavoriteIds
} from '../services/storageService'
import authService from '../services/authService'
import type { Question } from '../types'

const router = useRouter()
const route = useRoute()
const questionStore = useQuestionStore()

// 从store获取响应式数据
const questions = computed(() => questionStore.questions)
const loading = computed(() => questionStore.loading)
const error = computed(() => questionStore.error)
const categories = computed(() => questionStore.categories)
const pagination = computed(() => questionStore.pagination)
const filters = computed(() => questionStore.filters)

// 本地响应式数据
const searchKeyword = ref('')
const selectedCategory = ref('all')
const selectedDifficulty = ref('all')
const difficulties = ref([
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' }
])

// 统计数据
const favoriteCount = ref(0)

// 认证相关
const isLoggedIn = ref(false)
// 定义用户信息类型
interface UserInfo {
  username: string;
  email?: string;
  id?: string;
  [key: string]: any;
}
const userInfo = ref<UserInfo | null>(null)

// 计算属性
const currentPage = computed({
  get: () => pagination.value.page,
  set: (value) => questionStore.setPagination({ page: value })
})

const pageSize = computed({
  get: () => pagination.value.pageSize,
  set: (value) => questionStore.setPagination({ pageSize: value })
})

const total = computed(() => pagination.value.total)

// 初始化数据
onMounted(async () => {
  // 从URL参数恢复搜索状态
  const urlSearch = route.query.search as string
  if (urlSearch) {
    searchKeyword.value = urlSearch
    selectedCategory.value = 'all'
    selectedDifficulty.value = 'all'
  }

  // 检查是否已有缓存数据
  const cacheKey = questionStore.generateCacheKey(
    questionStore.filters, 
    questionStore.pagination.page, 
    questionStore.pagination.pageSize
  )
  
  const hasCache = questionStore.questionsCache.has(cacheKey) && 
                  questionStore.questions.length > 0
  
  // 只有在没有缓存数据时才重新加载
  if (!hasCache) {
    await loadData()
  } else {
    console.log('使用缓存数据，避免重新加载')
  }
  
  updateStats()
  await checkAuthStatus()
  
  // 监听页面可见性变化，当用户返回时更新统计数据
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

// 页面可见性变化处理
function handleVisibilityChange() {
  if (!document.hidden) {
    updateStats()
  }
}

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

// 监听筛选条件变化
watch([selectedCategory, selectedDifficulty], () => {
  handleFilter()
})

// 加载数据
async function loadData() {
  try {
    console.log('开始加载数据...')
    
    // 加载分类列表
    await questionStore.loadCategories()
    console.log('分类加载完成:', categories.value)
    
    // 设置初始筛选条件
    questionStore.setFilters({
      category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      difficulty: selectedDifficulty.value === 'all' ? undefined : selectedDifficulty.value,
      searchKeyword: searchKeyword.value || undefined
    })
    
    // 如果有搜索关键词，执行搜索，否则加载普通列表
    if (searchKeyword.value) {
      await questionStore.searchQuestions(searchKeyword.value)
    } else {
      await questionStore.loadQuestions()
    }
    
    console.log('题目加载完成:', questions.value.length, '条题目')
    console.log('分页信息:', pagination.value)
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 处理搜索
async function handleSearch() {
  if (searchKeyword.value.trim()) {
    // 更新URL参数
    router.replace({ query: { search: searchKeyword.value } })
    
    // 重置筛选条件
    selectedCategory.value = 'all'
    selectedDifficulty.value = 'all'
    
    // 执行搜索
    await questionStore.searchQuestions(searchKeyword.value)
  } else {
    // 清空搜索，重新加载列表
    router.replace({ query: {} })
    questionStore.setFilters({ searchKeyword: undefined })
    await questionStore.loadQuestions(true) // 强制刷新数据
  }
}

// 处理筛选
async function handleFilter() {
  questionStore.setFilters({
    category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
    difficulty: selectedDifficulty.value === 'all' ? undefined : selectedDifficulty.value,
    searchKeyword: searchKeyword.value || undefined
  })
  
  if (searchKeyword.value) {
    await questionStore.searchQuestions(searchKeyword.value)
  } else {
    await questionStore.loadQuestions(true) // 强制刷新数据
  }
}

// 重置筛选条件
async function resetFilters() {
  searchKeyword.value = ''
  selectedCategory.value = 'all'
  selectedDifficulty.value = 'all'
  
  // 清空URL参数
  router.replace({ query: {} })
  
  questionStore.resetFilters()
  // 强制刷新数据
  await questionStore.loadQuestions(true)
}

// 处理分页变化
async function handlePageChange() {
  if (searchKeyword.value) {
    await questionStore.searchQuestions(searchKeyword.value)
  } else {
    await questionStore.loadQuestions(true) // 强制刷新数据
  }
}

// 跳转到详情页
function goToDetail(id: number | string) {
  router.push(`/question/${id}`)
}

// 跳转到收藏页面
function goToFavorites() {
  router.push('/favorites')
}

// 跳转到关于页面
function goToAbout() {
  router.push('/about')
}

// 跳转到登录页面
function goToLogin() {
  router.push('/login')
}

// 跳转到注册页面
function goToRegister() {
  router.push('/register')
}

// 检查认证状态
async function checkAuthStatus() {
  isLoggedIn.value = authService.isLoggedIn()
  if (isLoggedIn.value) {
    userInfo.value = await authService.getCurrentUser()
  }
}

// 处理退出登录
async function handleLogout() {
  try {
    await authService.logout()
    isLoggedIn.value = false
    userInfo.value = null
    // 重新加载页面以清除状态
    window.location.reload()
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 更新统计数据
function updateStats() {
  const favoriteIds = getFavoriteIds()
  favoriteCount.value = Array.isArray(favoriteIds) ? favoriteIds.length : 0
}

// 获取难度主题色
function getDifficultyTheme(difficulty: string): 'success' | 'warning' | 'danger' | 'default' {
  const themes: Record<string, 'success' | 'warning' | 'danger'> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }
  return themes[difficulty] || 'default'
}

// 获取难度标签
function getDifficultyLabel(difficulty: string) {
  const labels = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return labels[difficulty as keyof typeof labels] || difficulty
}

// 截断文本
function truncateText(text: any, maxLength: number) {
  // 确保text是字符串
  if (text === null || text === undefined) return '';
  const textStr = String(text);
  if (textStr.length <= maxLength) return textStr;
  return textStr.substring(0, maxLength) + '...';
}

// 检查题目是否已收藏
function isFavoriteQuestion(questionId: number | string): boolean {
  return isFavorite(String(questionId))
}
</script>

<style scoped>
.question-list-container {
  min-height: 100vh;
  background-color: var(--td-bg-color-page);
}

.header {
  background: var(--td-bg-color-container);
  border-bottom: 1px solid var(--td-border-level-1-color);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.auth-buttons,
.user-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-button {
  position: relative;
  min-width: 120px;
}

.search-box {
  width: 300px;
}

.filter-bar {
  background: var(--td-bg-color-container);
  border-bottom: 1px solid var(--td-border-level-1-color);
  padding: 16px 0;
}

.filter-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: 500;
  color: var(--td-text-color-secondary);
  white-space: nowrap;
}

.main-content {
  padding: 24px 0;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.question-card {
  cursor: pointer;
  transition: all 0.2s ease;
  height: fit-content;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--td-shadow-2);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.favorite-tag {
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.question-id {
  font-size: 14px;
  color: var(--td-text-color-placeholder);
  font-weight: 500;
}

.question-content {
  margin-bottom: 16px;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.question-preview {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  line-height: 1.6;
  margin: 0;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--td-border-level-1-color);
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding-top: 32px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .nav-buttons {
    justify-content: center;
    width: 100%;
  }

  .nav-button {
    flex: 1;
    min-width: auto;
  }

  .search-box {
    width: 100%;
  }

  .filter-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .filter-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .questions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .question-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .tags {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .main-content {
    padding: 16px 0;
  }

  .title {
    font-size: 20px;
  }
}
</style>