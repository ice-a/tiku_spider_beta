<template>
  <Dialog
    v-model:visible="visible"
    header="网站公告"
    :width="500"
    :closable="false"
    :show-overlay="true"
    :destroy-on-close="true"
    placement="center"
  >
    <div class="announcement-content">
      <div class="announcement-header">
        <div class="announcement-icon">
          <NotificationIcon size="32" />
        </div>
        <div class="announcement-title">
          <h3>系统更新通知</h3>
          <p class="update-date">{{ formatDate(new Date()) }}</p>
        </div>
      </div>

      <div class="announcement-body">
        <div class="update-section">
          <h4>🎉 新功能上线</h4>
          <ul>
            <li>添加了通过wps表单提交题目的内容</li>
            <li>移除了注册、登录的功能，收藏的数据存储在本地浏览器中</li>
            <li>截止目前2025年10月15日共计5050道题目</li>
          </ul>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="announcement-footer">
        <Button @click="closeForSession" variant="outline" size="medium">
          本次关闭
        </Button>
        <Button @click="closeForToday" theme="primary" size="medium">
          今日不再显示
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Dialog, Button } from 'tdesign-vue-next'
import { NotificationIcon, InfoCircleIcon } from 'tdesign-icons-vue-next'

const visible = ref(false)

const STORAGE_KEY = 'announcement_closed_date'

// 检查是否应该显示公告
function shouldShowAnnouncement(): boolean {
  try {
    const closedDate = localStorage.getItem(STORAGE_KEY)
    if (!closedDate) return true
    
    const today = new Date().toDateString()
    const lastClosedDate = new Date(closedDate).toDateString()
    
    return today !== lastClosedDate
  } catch (error) {
    console.error('检查公告显示状态失败:', error)
    return true
  }
}

// 本次关闭
function closeForSession() {
  visible.value = false
}

// 今日关闭
function closeForToday() {
  try {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
  } catch (error) {
    console.error('保存公告关闭状态失败:', error)
  }
  visible.value = false
}

// 格式化日期
function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 显示公告
function showAnnouncement() {
  if (shouldShowAnnouncement()) {
    // 延迟显示，确保页面加载完成
    setTimeout(() => {
      visible.value = true
    }, 1000)
  }
}

// 组件挂载时检查是否需要显示公告
onMounted(() => {
  showAnnouncement()
})

// 暴露方法供父组件调用
defineExpose({
  showAnnouncement
})
</script>

<style scoped>
.announcement-content {
  padding: 8px 0;
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--td-border-level-1-color);
}

.announcement-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--td-brand-color-1), var(--td-brand-color-3));
  border-radius: 50%;
  color: var(--td-brand-color);
}

.announcement-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 4px 0;
}

.update-date {
  font-size: 14px;
  color: var(--td-text-color-secondary);
  margin: 0;
}

.announcement-body {
  max-height: 400px;
  overflow-y: auto;
}

.update-section {
  margin-bottom: 20px;
}

.update-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.update-section ul {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.update-section li {
  font-size: 14px;
  line-height: 1.6;
  color: var(--td-text-color-secondary);
  margin-bottom: 8px;
}

.tips-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--td-border-level-1-color);
}

.tips-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--td-brand-color-1);
  border: 1px solid var(--td-brand-color-3);
  border-radius: 6px;
  font-size: 14px;
  color: var(--td-brand-color);
}

.announcement-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .announcement-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .announcement-footer {
    flex-direction: column;
    gap: 8px;
  }

  .announcement-footer :deep(.t-button) {
    width: 100%;
  }
}
</style>