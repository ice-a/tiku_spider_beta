<template>
  <div class="question-detail-container">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <Breadcrumb>
          <BreadcrumbItem @click="goBack">题库首页</BreadcrumbItem>
          <BreadcrumbItem>题目详情</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="container">
        <div v-if="loading" class="loading-container">
          <Loading size="large" text="加载中..." />
        </div>

        <div v-else-if="!question" class="error-container">
          <Empty description="题目不存在">
            <Button @click="goBack" theme="primary">返回题库</Button>
          </Empty>
        </div>

        <div v-else class="question-detail">
          <!-- 题目信息卡片 -->
          <Card class="question-card">
            <div class="question-header">
              <div class="question-meta">
                <div class="meta-item">
                  <span class="meta-label">题目编号：</span>
                  <span class="meta-value">#{{ question.id }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">分类：</span>
                  <Tag theme="primary" variant="light">{{ question.category }}</Tag>
                </div>
                <div class="meta-item">
                  <span class="meta-label">难度：</span>
                  <Tag 
                    :theme="getDifficultyTheme(question.difficulty!)"
                    variant="light"
                  >
                    {{ getDifficultyLabel(question.difficulty!) }}
                  </Tag>
                </div>
              </div>
            </div>

            <Divider />

            <!-- 题目内容 -->
            <div class="question-content">
              <h2 class="question-title">题目</h2>
              <div class="question-text">{{ question.question }}</div>
            </div>

            <Divider />

            <!-- 答案内容 -->
            <div class="answer-content">
              <h2 class="answer-title">
                <span>答案解析</span>
                <Button
                  v-if="!showAnswer"
                  @click="toggleAnswer"
                  size="small"
                  theme="primary"
                  variant="outline"
                >
                  <template #icon>
                    <BrowseIcon />
                  </template>
                  显示答案
                </Button>
                <Button
                  v-else
                  @click="toggleAnswer"
                  size="small"
                  theme="default"
                  variant="outline"
                >
                  <template #icon>
                    <BrowseOffIcon />
                  </template>
                  隐藏答案
                </Button>
              </h2>
              
              <div v-if="showAnswer" class="answer-text">
                <div v-html="formatAnswer(question.answer)"></div>
              </div>
              
              <div v-else class="answer-placeholder">
                <div class="placeholder-content">
                  <BrowseOffIcon size="48" />
                  <p>先尝试回答问题，然后查看答案解析</p>
                </div>
              </div>
            </div>

            <!-- 标签 -->
            <div v-if="question.tags && question.tags.length > 0" class="tags-section">
              <Divider />
              <h3 class="tags-title">相关标签</h3>
              <div class="tags-list">
                <Tag
                  v-for="tag in question.tags"
                  :key="tag"
                  variant="outline"
                  @click="searchByTag(tag)"
                  class="clickable-tag"
                >
                  {{ tag }}
                </Tag>
              </div>
            </div>
          </Card>

          <!-- 收藏和操作按钮 -->
          <div class="favorite-section">
            <Card class="favorite-card">
              <div class="favorite-content">
                <div class="favorite-info">
                  <h3>喜欢这道题？</h3>
                  <p>收藏后可以在"我的收藏"中快速找到</p>
                </div>
                <Button
                  @click="toggleFavorite"
                  size="large"
                  :theme="isFavorited ? 'danger' : 'primary'"
                  :variant="isFavorited ? 'base' : 'outline'"
                  class="favorite-button"
                >
                  <template #icon>
                    <HeartIcon />
                  </template>
                  {{ isFavorited ? '取消收藏' : '收藏题目' }}
                </Button>
              </div>
            </Card>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <Button @click="goBack" size="large" variant="outline">
              <template #icon>
                <ArrowLeftIcon />
              </template>
              返回列表
            </Button>
            
            <div class="navigation-buttons">
              <Button
                v-if="prevQuestionId"
                @click="goToQuestion(prevQuestionId)"
                size="large"
                variant="outline"
              >
                <template #icon>
                  <ChevronLeftIcon />
                </template>
                上一题
              </Button>
              
              <Button
                v-if="nextQuestionId"
                @click="goToQuestion(nextQuestionId)"
                size="large"
                theme="primary"
              >
                下一题
                <template #suffix>
                  <ChevronRightIcon />
                </template>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Card,
  Tag,
  Button,
  Loading,
  Empty,
  Breadcrumb,
  BreadcrumbItem,
  Divider
} from 'tdesign-vue-next'
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BrowseIcon,
  BrowseOffIcon,
  HeartIcon,
  CheckCircleIcon,
  CloseCircleIcon
} from 'tdesign-icons-vue-next'
import { useQuestionStore } from '../stores/questionStore'
import {
  isFavorite,
  addToFavorites,
  removeFromFavorites
} from '../services/storageService'
import type { Question } from '../types'

const router = useRouter()
const route = useRoute()
const questionStore = useQuestionStore()

// 从store获取响应式数据
const currentQuestion = computed(() => questionStore.currentQuestion)
const loading = computed(() => questionStore.loading)
const questions = computed(() => questionStore.questions)

// 本地响应式数据
const showAnswer = ref(false)
const isFavorited = ref(false)

// 计算属性
const questionId = computed(() => route.params.id as string)

const question = computed(() => currentQuestion.value)

const prevQuestionId = computed(() => {
  const { prevId } = questionStore.getAdjacentQuestionIds(questionId.value)
  return prevId
})

const nextQuestionId = computed(() => {
  const { nextId } = questionStore.getAdjacentQuestionIds(questionId.value)
  return nextId
})

// 初始化
onMounted(async () => {
  await loadQuestion()
  updateFavoriteStatus()
})

// 监听路由参数变化
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await loadQuestion()
    resetAnswerState()
    updateFavoriteStatus()
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

// 加载题目数据
async function loadQuestion() {
  try {
    await questionStore.loadQuestionDetail(questionId.value)
    updateFavoriteStatus()
  } catch (error) {
    console.error('加载题目失败:', error)
  }
}

// 切换答案显示
function toggleAnswer() {
  showAnswer.value = !showAnswer.value
}

// 格式化答案文本
function formatAnswer(answer: string) {
  // 将换行符转换为HTML换行
  return answer.replace(/\n/g, '<br>')
}

// 返回列表页
function goBack() {
  router.push('/')
}

// 跳转到指定题目
function goToQuestion(id: number | string) {
  router.push(`/question/${id}`)
}

// 根据标签搜索
function searchByTag(tag: string) {
  router.push(`/?search=${encodeURIComponent(tag)}`)
}

// 更新收藏状态
function updateFavoriteStatus() {
  if (question.value?.id) {
    isFavorited.value = isFavorite(question.value.id)
  }
}

// 切换收藏状态
function toggleFavorite() {
  if (!question.value?.id) return
  
  if (isFavorited.value) {
    removeFromFavorites(question.value.id)
    isFavorited.value = false
  } else {
    addToFavorites(question.value.id)
    isFavorited.value = true
  }
}

// 重置答题状态
function resetAnswerState() {
  showAnswer.value = false
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
</script>

<style scoped>
.question-detail-container {
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

.main-content {
  padding: 24px 0;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.question-detail {
  max-width: 800px;
  margin: 0 auto;
}

.question-card {
  margin-bottom: 24px;
}

.question-header {
  margin-bottom: 0;
}

.question-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-label {
  font-weight: 500;
  color: var(--td-text-color-secondary);
}

.meta-value {
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.question-content,
.answer-content {
  margin: 24px 0;
}

.question-title,
.answer-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--td-text-color-primary);
  background: var(--td-bg-color-secondarycontainer);
  padding: 20px;
  border-radius: 6px;
  border-left: 4px solid var(--td-brand-color);
}

.answer-text {
  font-size: 15px;
  line-height: 1.8;
  color: var(--td-text-color-primary);
  background: var(--td-success-color-light);
  padding: 20px;
  border-radius: 6px;
  border-left: 4px solid var(--td-success-color);
}

.answer-text :deep(br) {
  margin-bottom: 8px;
}

.answer-placeholder {
  background: var(--td-bg-color-secondarycontainer);
  border: 2px dashed var(--td-border-level-2-color);
  border-radius: 6px;
  padding: 40px 20px;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--td-text-color-placeholder);
}

.placeholder-content p {
  margin: 0;
  font-size: 14px;
}



.tags-section {
  margin-top: 0;
}

.tags-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 16px 0 12px 0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.clickable-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-tag:hover {
  transform: translateY(-1px);
  box-shadow: var(--td-shadow-1);
}

.favorite-section {
  margin-bottom: 24px;
}

.favorite-card {
  background: linear-gradient(135deg, var(--td-brand-color-1), var(--td-brand-color-2));
  border: 1px solid var(--td-brand-color-3);
}

.favorite-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.favorite-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 8px 0;
}

.favorite-info p {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  margin: 0;
}

.favorite-button {
  min-width: 120px;
  transition: all 0.3s ease;
}

.favorite-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--td-shadow-2);
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
}

.navigation-buttons {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-meta {
    flex-direction: column;
    gap: 12px;
  }

  .meta-item {
    justify-content: space-between;
  }

  .question-title,
  .answer-title {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .favorite-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .navigation-buttons {
    justify-content: space-between;
  }

  .question-text,
  .answer-text {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .main-content {
    padding: 16px 0;
  }

  .navigation-buttons {
    flex-direction: column;
    gap: 12px;
  }
}
</style>