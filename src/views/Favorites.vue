<template>
  <div class="favorites-container">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <Breadcrumb>
          <BreadcrumbItem @click="goBack">题库首页</BreadcrumbItem>
          <BreadcrumbItem>我的收藏</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>

    <!-- 标签页切换 -->
    <div class="tabs-container">
      <div class="container">
        <Tabs v-model="activeTab" @change="handleTabChange">
          <TabPanel value="favorites" label="收藏题目">
            <div class="tab-content">
              <div class="stats-bar">
                <div class="stats-item">
                  <span class="stats-label">收藏题目：</span>
                  <span class="stats-value">{{ favoriteQuestions.length }} 题</span>
                </div>
                <Button
                  v-if="favoriteQuestions.length > 0"
                  @click="clearAllFavorites"
                  variant="outline"
                  theme="danger"
                  size="small"
                >
                  清空收藏
                </Button>
              </div>

              <div v-if="favoriteQuestions.length === 0" class="empty-container">
                <Empty description="还没有收藏任何题目">
                  <Button @click="goBack" theme="primary">去刷题</Button>
                </Empty>
              </div>

              <div v-else class="questions-grid">
                <Card
                  v-for="question in favoriteQuestions"
                  :key="question.id"
                  class="question-card"
                  hover
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
                    </div>
                    <div class="question-actions">
                      <Button
                        @click="goToDetail(question.id!)"
                        size="small"
                        theme="primary"
                        variant="text"
                      >
                        查看
                      </Button>
                      <Button
                        @click="removeFavorite(question.id!)"
                        size="small"
                        theme="danger"
                        variant="text"
                      >
                        取消收藏
                      </Button>
                    </div>
                  </div>
                  
                  <div class="question-content" @click="goToDetail(question.id!)">
                    <h3 class="question-title">{{ truncateText(question.question, 100) }}</h3>
                    <p class="question-preview">{{ truncateText(question.answer, 120) }}</p>
                  </div>
                </Card>
              </div>
            </div>
          </TabPanel>

          <TabPanel value="wrong-answers" label="错题本">
            <div class="tab-content">
              <div class="stats-bar">
                <div class="stats-item">
                  <span class="stats-label">错题数量：</span>
                  <span class="stats-value">{{ wrongQuestions.length }} 题</span>
                </div>
                <div class="action-buttons">
                  <Button
                    v-if="wrongQuestions.length > 0"
                    @click="startWrongQuestionPractice"
                    theme="primary"
                    size="small"
                  >
                    <template #icon>
                      <PlayIcon />
                    </template>
                    错题练习
                  </Button>
                  <Button
                    v-if="wrongQuestions.length > 0"
                    @click="clearAllWrongAnswers"
                    variant="outline"
                    theme="danger"
                    size="small"
                  >
                    清空错题
                  </Button>
                </div>
              </div>

              <div v-if="wrongQuestions.length === 0" class="empty-container">
                <Empty description="暂无错题记录">
                  <Button @click="goBack" theme="primary">去刷题</Button>
                </Empty>
              </div>

              <div v-else class="questions-grid">
                <Card
                  v-for="question in wrongQuestions"
                  :key="question.id"
                  class="question-card wrong-question-card"
                  hover
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
                      <Tag theme="danger" variant="light">错题</Tag>
                    </div>
                    <div class="question-actions">
                      <Button
                        @click="goToDetail(question.id!)"
                        size="small"
                        theme="primary"
                        variant="text"
                      >
                        查看
                      </Button>
                      <Button
                        @click="removeWrongAnswer(question.id!)"
                        size="small"
                        theme="success"
                        variant="text"
                      >
                        已掌握
                      </Button>
                    </div>
                  </div>
                  
                  <div class="question-content" @click="goToDetail(question.id!)">
                    <h3 class="question-title">{{ truncateText(question.question, 100) }}</h3>
                    <p class="question-preview">{{ truncateText(question.answer, 120) }}</p>
                  </div>
                </Card>
              </div>
            </div>
          </TabPanel>

          <TabPanel value="stats" label="学习统计">
            <div class="tab-content">
              <div class="stats-overview">
                <Card class="stats-card">
                  <h3>学习概况</h3>
                  <div class="stats-grid">
                    <div class="stat-item">
                      <div class="stat-number">{{ studyStats.totalAnswered }}</div>
                      <div class="stat-label">已答题目</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number correct">{{ studyStats.correctCount }}</div>
                      <div class="stat-label">答对题目</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number wrong">{{ studyStats.wrongCount }}</div>
                      <div class="stat-label">答错题目</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number favorite">{{ studyStats.favoriteCount }}</div>
                      <div class="stat-label">收藏题目</div>
                    </div>
                  </div>
                  
                  <div class="accuracy-section">
                    <h4>答题准确率</h4>
                    <div class="accuracy-bar">
                      <div 
                        class="accuracy-fill"
                        :style="{ width: accuracyPercentage + '%' }"
                      ></div>
                    </div>
                    <div class="accuracy-text">{{ accuracyPercentage.toFixed(1) }}%</div>
                  </div>
                </Card>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  Tag,
  Button,
  Empty,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabPanel,
  MessagePlugin
} from 'tdesign-vue-next'
import {
  PlayIcon
} from 'tdesign-icons-vue-next'
import { useQuestionStore } from '../stores/questionStore'
import {
  getFavoriteIds,
  getWrongAnswerIds,
  getStudyStats,
  removeFromFavorites,
  removeFromWrongAnswers,
  getUserData,
  saveUserData
} from '../services/storageService'
import type { Question } from '../types'

const router = useRouter()
const questionStore = useQuestionStore()

// 响应式数据
const activeTab = ref('favorites')
const favoriteQuestions = ref<Question[]>([])
const wrongQuestions = ref<Question[]>([])
const studyStats = ref(getStudyStats())

// 从store获取数据
const questions = computed(() => questionStore.questions)
const loading = computed(() => questionStore.loading)

// 计算属性
const accuracyPercentage = computed(() => {
  if (studyStats.value.totalAnswered === 0) return 0
  return (studyStats.value.correctCount / studyStats.value.totalAnswered) * 100
})

// 初始化
onMounted(async () => {
  await loadData()
})

// 加载数据
async function loadData() {
  // 确保题目数据已加载
  if (questions.value.length === 0) {
    await questionStore.loadQuestions()
  }
  
  // 加载收藏题目
  const favoriteIds = getFavoriteIds()
  favoriteQuestions.value = favoriteIds
    .map(id => questions.value.find(q => q.id === id))
    .filter(q => q !== undefined) as Question[]
  
  // 加载错题
  const wrongIds = getWrongAnswerIds()
  wrongQuestions.value = wrongIds
    .map(id => questions.value.find(q => q.id === id))
    .filter(q => q !== undefined) as Question[]
  
  // 更新统计数据
  studyStats.value = getStudyStats()
}

// 处理标签页切换
function handleTabChange(value: string) {
  activeTab.value = value
}

// 返回首页
function goBack() {
  router.push('/')
}

// 跳转到题目详情
function goToDetail(id: string) {
  router.push(`/question/${id}`)
}

// 移除收藏
function removeFavorite(questionId: string) {
  removeFromFavorites(questionId)
  loadData()
  MessagePlugin.success('已取消收藏')
}

// 移除错题
function removeWrongAnswer(questionId: string) {
  removeFromWrongAnswers(questionId)
  loadData()
  MessagePlugin.success('已标记为掌握')
}

// 清空所有收藏
function clearAllFavorites() {
  const userData = getUserData()
  userData.favorites = []
  saveUserData(userData)
  loadData()
  MessagePlugin.success('已清空所有收藏')
}

// 清空所有错题
function clearAllWrongAnswers() {
  const userData = getUserData()
  userData.wrongAnswers = []
  saveUserData(userData)
  loadData()
  MessagePlugin.success('已清空错题本')
}

// 开始错题练习
function startWrongQuestionPractice() {
  if (wrongQuestions.value.length > 0) {
    router.push(`/question/${wrongQuestions.value[0].id}`)
  }
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
function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.favorites-container {
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

.tabs-container {
  padding: 24px 0;
}

.tab-content {
  padding-top: 24px;
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--td-bg-color-container);
  border-radius: 6px;
  border: 1px solid var(--td-border-level-1-color);
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-label {
  font-weight: 500;
  color: var(--td-text-color-secondary);
}

.stats-value {
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.question-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--td-shadow-2);
}

.wrong-question-card {
  border-left: 4px solid var(--td-error-color);
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

.question-actions {
  display: flex;
  gap: 8px;
}

.question-content {
  cursor: pointer;
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

.stats-overview {
  max-width: 600px;
  margin: 0 auto;
}

.stats-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 24px 0;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: var(--td-bg-color-secondarycontainer);
  border-radius: 8px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--td-text-color-primary);
  margin-bottom: 8px;
}

.stat-number.correct {
  color: var(--td-success-color);
}

.stat-number.wrong {
  color: var(--td-error-color);
}

.stat-number.favorite {
  color: var(--td-warning-color);
}

.stat-label {
  font-size: 14px;
  color: var(--td-text-color-secondary);
}

.accuracy-section {
  text-align: center;
}

.accuracy-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 16px 0;
}

.accuracy-bar {
  width: 100%;
  height: 12px;
  background: var(--td-bg-color-component);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.accuracy-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--td-success-color), var(--td-brand-color));
  transition: width 0.3s ease;
}

.accuracy-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--td-brand-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-bar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: center;
  }

  .questions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .question-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .question-actions {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .tabs-container {
    padding: 16px 0;
  }
}
</style>