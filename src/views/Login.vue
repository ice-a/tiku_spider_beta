<template>
  <div class="login-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="title">在线题库系统</h1>
          <div class="header-actions">
            <div class="nav-buttons">
              <Button @click="goToHome" variant="outline" class="nav-button">
                <template #icon>
                  <HomeIcon />
                </template>
                首页
              </Button>
              <Button @click="goToAbout" variant="outline" theme="default" class="nav-button">
                <template #icon>
                  <InfoCircleIcon />
                </template>
                关于
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="container">
        <div class="login-wrapper">
          <!-- Logo和标题 -->
          <div class="login-header">
            <div class="logo-container">
              <BookIcon class="logo-icon" />
            </div>
            <h2 class="login-title">
              欢迎回来
            </h2>
            <p class="login-subtitle">
              登录您的账户，继续学习之旅
            </p>
            <p class="login-link">
              还没有账户？
              <router-link to="/register" class="link">
                立即注册
              </router-link>
            </p>
          </div>
          
          <!-- 登录卡片 -->
          <div class="login-card">
            <Form :data="form" @submit="handleLogin" class="login-form">
              <div class="form-fields">
                <div class="form-group">
                  <label class="form-label">用户名或邮箱</label>
                  <FormItem>
                    <Input
                      v-model="form.username"
                      placeholder="请输入用户名或邮箱"
                      size="large"
                      clearable
                      class="custom-input"
                    >
                      <template #prefix-icon>
                        <User1Icon />
                      </template>
                    </Input>
                  </FormItem>
                </div>
                
                <div class="form-group">
                  <label class="form-label">密码</label>
                  <FormItem>
                    <Input
                      v-model="form.password"
                      type="password"
                      placeholder="请输入密码"
                      size="large"
                      clearable
                      class="custom-input"
                    >
                      <template #prefix-icon>
                        <LockOnIcon />
                      </template>
                    </Input>
                  </FormItem>
                </div>
              </div>

              <!-- 记住我和忘记密码 -->
              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox" v-model="form.rememberMe">
                  <span>记住我</span>
                </label>
                <a href="#" class="forgot-password">忘记密码？</a>
              </div>

              <!-- 验证码区域 -->
              <div v-if="showCaptcha" class="captcha-section">
                <Alert
                  theme="warning"
                  message="需要验证码验证"
                  description="由于频繁操作，请输入验证码继续"
                />
                <FormItem>
                  <Input
                    v-model="form.captcha"
                    placeholder="请输入验证码"
                    size="large"
                    clearable
                    class="custom-input"
                  />
                </FormItem>
              </div>

              <FormItem v-if="error">
                <Alert
                  theme="error"
                  :message="error"
                />
              </FormItem>

              <FormItem>
                <Button
                  theme="primary"
                  :loading="loading"
                  type="submit"
                  size="large"
                  class="login-btn"
                >
                  {{ loading ? '登录中...' : '立即登录' }}
                </Button>
              </FormItem>

              <!-- 第三方登录 -->
              <div class="social-login">
                <p class="social-text">或使用其他方式登录</p>
                <div class="social-buttons">
                  <button class="social-btn">
                    <LogoWechatStrokeIcon />
                  </button>
                  <button class="social-btn">
                    <LogoGithubIcon />
                  </button>
                  <button class="social-btn">
                    <LogoQqIcon />
                  </button>
                </div>
              </div>
            </Form>
          </div>

          <div class="footer-text">
            © 2024 题库系统 - 专业在线学习平台
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Form,
  FormItem,
  Input,
  Button,
  Alert
} from 'tdesign-vue-next'
import {
  User1Icon,
  LockOnIcon,
  LogoWechatStrokeIcon,
  LogoGithubIcon,
  LogoQqIcon,
  BookIcon,
  HomeIcon,
  InfoCircleIcon
} from 'tdesign-icons-vue-next'
import authService from '../services/authService.js'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const showCaptcha = ref(false)
const backgroundImage = ref('')

const form = reactive({
  username: '',
  password: '',
  captcha: '',
  rememberMe: false
})

// 获取随机背景图片
const loadBackgroundImage = () => {
  try {
    // 直接设置图片URL，API返回的是图片本身
    backgroundImage.value = 'https://api.fw1028.top/scenery.php?return=img'
  } catch (error) {
    console.log('背景图片加载失败，使用默认背景')
  }
}

onMounted(() => {
  // 如果已经登录，重定向到首页
  if (authService.isLoggedIn()) {
    router.push('/')
  }
  
  // 加载背景图片
  loadBackgroundImage()
})

// 导航方法
const goToHome = () => {
  router.push('/')
}

const goToAbout = () => {
  router.push('/about')
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await authService.login({
      username: form.username,
      password: form.password
    })

    if (result.message === '登录成功') {
      // 登录成功，重定向到首页
      router.push('/')
    }
  } catch (err) {
    error.value = err.message
    
    // 检查是否需要验证码
    if (err.message.includes('需要验证码')) {
      showCaptcha.value = true
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: var(--td-bg-color-page);
  background-image: v-bind('backgroundImage ? `url(${backgroundImage})` : "none"');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.login-container > * {
  position: relative;
  z-index: 2;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
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

.nav-button {
  min-width: 100px;
}

.main-content {
  padding: 40px 0;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
}

.login-wrapper {
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-container {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.logo-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
}

.logo-icon {
  width: 40px;
  height: 40px;
  color: white;
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--td-text-color-primary);
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  font-size: 16px;
  color: var(--td-text-color-secondary);
  margin: 0 0 16px 0;
}

.login-link {
  font-size: 14px;
  color: var(--td-text-color-placeholder);
}

.link {
  color: var(--td-brand-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link:hover {
  color: var(--td-brand-color-hover);
  text-decoration: underline;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--td-text-color-secondary);
}

.remember-me input {
  width: 16px;
  height: 16px;
  accent-color: var(--td-brand-color);
}

.forgot-password {
  font-size: 14px;
  color: var(--td-brand-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: var(--td-brand-color-hover);
  text-decoration: underline;
}

.captcha-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

.social-login {
  text-align: center;
}

.social-text {
  font-size: 14px;
  color: var(--td-text-color-placeholder);
  margin: 0 0 16px 0;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--td-bg-color-secondarycontainer);
  border: 1px solid var(--td-border-level-1-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: var(--td-bg-color-container-hover);
  transform: translateY(-1px);
}

.footer-text {
  text-align: center;
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .nav-buttons {
    justify-content: center;
    width: 100%;
  }

  .nav-button {
    flex: 1;
    min-width: auto;
  }

  .main-content {
    padding: 24px 0;
  }

  .login-card {
    padding: 24px;
  }

  .login-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .title {
    font-size: 20px;
  }

  .login-title {
    font-size: 24px;
  }
}
</style>