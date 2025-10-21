<template>
  <div class="about-container">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <Breadcrumb>
          <BreadcrumbItem @click="goBack">题库首页</BreadcrumbItem>
          <BreadcrumbItem>关于我们</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="container">
        <!-- 应用介绍 -->
        <Card class="intro-card">
          <div class="intro-content">
            <div class="intro-header">
              <div class="app-icon">
                <BookIcon size="48" />
              </div>
              <div class="app-info">
                <h1 class="app-title">在线题库系统</h1>
                <p class="app-version">Version 1.0.0</p>
              </div>
            </div>
            
            <Divider />
            
            <div class="app-description">
              <h2>关于本应用</h2>
              <p>
                这是一个专为编程学习者设计的在线题库系统，涵盖了爬虫技术、反爬虫技术、逆向工程等多个技术领域。
                我们致力于为开发者提供高质量的学习资源和便捷的学习体验。
              </p>
              
              <h3>主要功能</h3>
              <ul class="feature-list">
                <li><CheckCircleIcon size="16" /> 丰富的题目库，涵盖多个技术领域</li>
                <li><CheckCircleIcon size="16" /> 智能分类和难度标记</li>
                <li><CheckCircleIcon size="16" /> 个人收藏和错题本功能</li>
                <li><CheckCircleIcon size="16" /> 学习进度统计和分析</li>
                <li><CheckCircleIcon size="16" /> 响应式设计，支持多端访问</li>
                <li><CheckCircleIcon size="16" /> <a href="https://f.wps.cn/g/5tIf092F" target="_blank">在线提交新的题目</a></li>
              </ul>
              
              <h3>技术栈</h3>
              <div class="tech-stack">
                <Tag theme="primary" variant="light">Vue 3</Tag>
                <Tag theme="success" variant="light">TypeScript</Tag>
                <Tag theme="warning" variant="light">TDesign Vue Next</Tag>
                <Tag theme="danger" variant="light">Vite</Tag>
              </div>

              <h3>数据来源</h3>
              <p>
                本题库包含以下技术领域的题目：
              </p>
              <div class="data-categories">
                <Tag variant="outline">爬虫基础</Tag>
                <Tag variant="outline">爬虫进阶</Tag>
                <Tag variant="outline">爬虫高级</Tag>
                <Tag variant="outline">逆向工程</Tag>
                <Tag variant="outline">反爬虫</Tag>
                <Tag variant="outline">反爬虫高级</Tag>
                <Tag variant="outline">面试真题</Tag>
              </div>
            </div>
          </div>
        </Card>

        <!-- 交流群 -->
        <Card class="donation-card">
          <div class="donation-content">
            <h2>
              <HeartIcon size="24" />
              交流群
            </h2>
            <p>good good study day day up</p>
            <p class="hitokoto-text">"{{ hitokoto }}"</p>
            <div class="donation-section">
              <div class="donation-item">
                <img src="/talk.jpg" alt="WeChat Pay" class="donation-qr-code" />
                <p>爬虫宝子们学习交流群</p>
              </div>
              <div class="donation-item">
                <img src="/spiderdemo.jpg" alt="Alipay" class="donation-qr-code" />
                <p>spiderdemo联系平台(添加大佬可以备注题库练习平台)</p>
              </div>
            </div>
          </div>
        </Card>
        <!-- 赞赏区域 -->
        <Card class="donation-card">
          <div class="donation-content">
            <h2>
              <HeartIcon size="24" />
              支持项目
            </h2>
            <p>如果这个项目对您有帮助，欢迎通过以下方式支持我们。您的支持是我们不断前进的动力！</p>
            <p class="hitokoto-text">"{{ hitokoto }}"</p>
            <div class="donation-section">
              <div class="donation-item">
                <img src="/wechat.jpg" alt="WeChat Pay" class="donation-qr-code" />
                <p>微信赞赏</p>
              </div>
              <div class="donation-item">
                <img src="/alipay.png" alt="Alipay" class="donation-qr-code" />
                <p>支付宝赞赏</p>
              </div>
            </div>
          </div>
        </Card>


        <!-- 推荐资源区域 -->
        <Card class="ad-section">
          <div class="ad-content">
            <h2>
              <StarIcon size="24" />
              推荐资源
            </h2>
            <p>以下是我们为您精选的学习资源和工具：</p>
            
            <div class="links-grid">
              <Tooltip
                v-for="link in recommendedLinks"
                :key="link.name"
                :content="link.desc || '暂无描述'"
                placement="top"
                :disabled="!link.desc"
              >
                <Card 
                  class="link-card" 
                  hover
                  @click="openLink(link.url)"
                >
                  <div class="link-content">
                    <div class="link-icon">
                      <LinkIcon size="20" />
                    </div>
                    <div class="link-info">
                      <h3 class="link-title">{{ link.name }}</h3>
                      <p class="link-url">{{ link.url }}</p>
                    </div>
                  </div>
                </Card>
              </Tooltip>
            </div>
          </div>
        </Card>

       
 <!-- 联系信息 -->
        <Card class="contact-card">
          <div class="contact-content">
            
            <div class="contact-methods">
              <div class="contact-item">
                <MailIcon size="20" />
                <span>邮箱：leebigshan@gmail.com</span>
              </div>
            </div>

            <Divider />

            <div class="feedback-section">
              <h3>题目贡献</h3>
              <p>
                如果您有优质的题目想要分享，或者发现了题目中的错误，欢迎通过邮箱联系我们。
                我们会认真审核每一份贡献，让题库变得更加完善。
              </p>
              <div class="contribution-tips">
                <h4>贡献指南：</h4>
                <ul>
                  <li>题目内容要清晰明确，避免歧义</li>
                  <li>答案解析要详细，包含解题思路</li>
                  <li>如有代码示例，请确保代码正确可运行</li>
                  <li>标注题目的难度级别和所属分类</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
        <!-- 版权信息 -->
        <Card class="copyright-card">
          <div class="copyright-content">
            <p>&copy; 2024 在线题库系统. All rights reserved.</p>
            <p>本项目仅供学习交流使用，请勿用于商业用途。</p>
          </div>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
  Tag,
  Tooltip
} from 'tdesign-vue-next'
import {
  BookIcon,
  CheckCircleIcon,
  MailIcon,
  LinkIcon,
  EarthIcon,
  StarIcon,
  HeartIcon
} from 'tdesign-icons-vue-next'

const router = useRouter()

// 推荐链接数据
const recommendedLinks = ref([])

// 从public/links.json加载推荐链接
const loadRecommendedLinks = async () => {
  try {
    const response = await fetch('/links.json')
    const links = await response.json()
    recommendedLinks.value = links
  } catch (error) {
    console.error('加载推荐链接失败:', error)
    // 如果加载失败，使用默认链接
    recommendedLinks.value = [
      {
        name: 'Vue.js 官方文档',
        url: 'https://cn.vuejs.org/',
        desc: '学习Vue.js的最佳资源'
      },
      {
        name: 'TDesign 组件库',
        url: 'https://tdesign.tencent.com/',
        desc: '企业级设计语言和组件库'
      }
    ]
  }
}

// 返回首页
function goBack() {
  router.push('/')
}

// 打开链接
function openLink(url: string) {
  window.open(url, '_blank')
}

const hitokoto = ref('正在获取...')

onMounted(async () => {
  loadRecommendedLinks()
  try {
    const response = await fetch('https://v1.hitokoto.cn/?encode=text')
    if (response.ok) {
      hitokoto.value = await response.text()
    } else {
      hitokoto.value = '生活明朗，万物可爱。' // fallback
    }
  } catch (error) {
    console.error('Failed to fetch hitokoto:', error)
    hitokoto.value = '生活明朗，万物可爱。' // fallback
  }
})
</script>

<style scoped>
.about-container {
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

.intro-card,
.contact-card,
.copyright-card {
  margin-bottom: 32px;
}

.intro-content {
  padding: 8px 0;
}

.intro-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 0;
}

.app-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--td-brand-color-1), var(--td-brand-color-3));
  border-radius: 16px;
  color: var(--td-brand-color);
}

.app-info {
  flex: 1;
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--td-text-color-primary);
  margin: 0 0 8px 0;
}

.app-version {
  font-size: 16px;
  color: var(--td-text-color-secondary);
  margin: 0;
}

.app-description h2,
.app-description h3 {
  color: var(--td-text-color-primary);
  margin: 24px 0 16px 0;
}

.app-description h2 {
  font-size: 20px;
  font-weight: 600;
}

.app-description h3 {
  font-size: 18px;
  font-weight: 600;
}

.app-description p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--td-text-color-secondary);
  margin: 0 0 16px 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 15px;
  color: var(--td-text-color-primary);
}

.tech-stack,
.data-categories {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.contact-card {
  background: linear-gradient(135deg, var(--td-brand-color-1), var(--td-brand-color-2));
  border: 1px solid var(--td-brand-color-3);
}

.contact-content h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 16px 0;
}

.contact-content p {
  font-size: 16px;
  color: var(--td-text-color-secondary);
  margin: 0 0 24px 0;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--td-text-color-primary);
}

.feedback-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 24px 0 16px 0;
}

.feedback-section p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--td-text-color-secondary);
  margin: 0 0 16px 0;
}

.contribution-tips h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 16px 0 12px 0;
}

.contribution-tips ul {
  margin: 0;
  padding-left: 20px;
}

.contribution-tips li {
  font-size: 14px;
  line-height: 1.5;
  color: var(--td-text-color-secondary);
  margin-bottom: 8px;
}

.copyright-card {
  background: var(--td-bg-color-secondarycontainer);
  border: 1px solid var(--td-border-level-1-color);
}

.copyright-content {
  text-align: center;
  padding: 16px 0;
}

.copyright-content p {
  font-size: 14px;
  color: var(--td-text-color-placeholder);
  margin: 4px 0;
}

/* 广告区域样式 */
.ad-section {
  background: linear-gradient(135deg, var(--td-success-color-1), var(--td-success-color-2));
  border: 1px solid var(--td-success-color-3);
}

.ad-content h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 16px 0;
}

.ad-content p {
  font-size: 16px;
  color: var(--td-text-color-secondary);
  margin: 0 0 24px 0;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.link-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--td-border-level-1-color);
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--td-shadow-2);
  border-color: var(--td-brand-color-3);
}

.link-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--td-brand-color-1);
  border-radius: 8px;
  color: var(--td-brand-color);
  flex-shrink: 0;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-url {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.donation-card {
  margin-bottom: 32px;
}

.donation-content h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0 0 16px 0;
}

.donation-content p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--td-text-color-secondary);
  margin: 0 0 16px 0;
}

.hitokoto-text {
  text-align: center;
  font-style: italic;
  margin: 20px 0;
  font-size: 16px;
  color: var(--td-text-color-secondary);
  padding: 16px;
  background: var(--td-bg-color-secondarycontainer);
  border-radius: 6px;
}

.donation-section {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  text-align: center;
  flex-wrap: wrap;
}

.donation-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.donation-qr-code {
  width: 180px;
  height: 180px;
  border-radius: 8px;
  border: 1px solid var(--td-border-level-1-color);
  margin-bottom: 12px;
  padding: 8px;
  background: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .intro-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .app-title {
    font-size: 24px;
  }

  .tech-stack,
  .data-categories {
    justify-content: center;
  }

  .contact-methods {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .main-content {
    padding: 16px 0;
  }

  .intro-card,
  .contact-card,
  .copyright-card {
    margin-bottom: 24px;
  }

  .app-icon {
    width: 60px;
    height: 60px;
  }

  .app-title {
    font-size: 20px;
  }
}
</style>