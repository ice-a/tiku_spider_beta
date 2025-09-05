<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- 背景装饰元素 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute top-1/4 left-1/4 w-40 h-40 bg-purple-200 rounded-full opacity-15 blur-2xl"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Logo和标题 -->
      <div class="text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <UserIcon class="w-10 h-10 text-white" />
        </div>
        <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          创建账号
        </h2>
        <p class="text-gray-600 text-lg">
          或
          <router-link to="/login" class="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
            已有账号登录
          </router-link>
        </p>
      </div>
      
      <!-- 注册卡片 -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100/50">
        <t-form :data="form" :rules="rules" @submit="handleRegister" class="space-y-6">
          <div class="space-y-4">
            <t-form-item name="username">
              <t-input
                v-model="form.username"
                placeholder="请输入用户名"
                size="large"
                clearable
                class="custom-input"
              >
                <template #prefix-icon>
                  <UserIcon class="w-5 h-5" />
                </template>
              </t-input>
            </t-form-item>
            
            <t-form-item name="email">
              <t-input
                v-model="form.email"
                placeholder="请输入邮箱"
                size="large"
                clearable
                class="custom-input"
              >
                <template #prefix-icon>
                  <MailIcon class="w-5 h-5" />
                </template>
              </t-input>
            </t-form-item>
            
            <t-form-item name="password">
              <t-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                clearable
                class="custom-input"
              >
                <template #prefix-icon>
                  <LockOnIcon class="w-5 h-5" />
                </template>
              </t-input>
            </t-form-item>

            <t-form-item name="confirmPassword">
              <t-input
                v-model="form.confirmPassword"
                type="password"
                placeholder="请确认密码"
                size="large"
                clearable
                class="custom-input"
              >
                <template #prefix-icon>
                  <LockOnIcon class="w-5 h-5" />
                </template>
              </t-input>
            </t-form-item>
          </div>

          <!-- 验证码区域 -->
          <div v-if="showCaptcha" class="space-y-4">
            <t-alert
              theme="warning"
              icon
              title="需要验证码验证"
              description="请输入验证码完成注册"
              class="rounded-xl"
            />
            <t-form-item name="captcha">
              <t-input
                v-model="form.captcha"
                placeholder="请输入验证码"
                size="large"
                clearable
                class="custom-input"
              />
            </t-form-item>
          </div>

          <t-form-item v-if="error">
            <t-alert
              theme="error"
              icon
              :title="error"
              closable
              class="rounded-xl"
            />
          </t-form-item>

          <t-form-item>
            <t-button
              theme="primary"
              :loading="loading"
              type="submit"
              size="large"
              class="w-full register-btn"
            >
              {{ loading ? '注册中...' : '立即注册' }}
            </t-button>
          </t-form-item>

          <!-- 第三方注册 -->
          <div class="text-center">
            <p class="text-gray-500 text-sm mb-4">或使用其他方式注册</p>
            <div class="flex justify-center space-x-4">
              <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center">
                <LogoWechatStrokeIcon class="w-5 h-5 text-green-600" />
              </button>
              <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center">
                <StarIcon class="w-5 h-5 text-gray-800" />
              </button>
              <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center">
                <LogoQqIcon class="w-5 h-5 text-blue-500" />
              </button>
            </div>
          </div>
        </t-form>
      </div>

      <div class="text-center text-sm text-gray-500">
        © 2024 题库系统 - 专业在线学习平台
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserIcon, MailIcon, LockOnIcon, LogoWechatStrokeIcon, LogoGithubIcon, LogoQqIcon } from 'tdesign-icons-vue-next'
import authService from '../services/authService.js'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const showCaptcha = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  captcha: ''
})

const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
})

onMounted(() => {
  // 如果已经登录，重定向到首页
  if (authService.isLoggedIn()) {
    router.push('/')
  }
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await authService.register({
      username: form.username,
      email: form.email,
      password: form.password,
      captcha: form.captcha
    })

    if (result.message === '注册成功') {
      // 注册成功，重定向到登录页面
      router.push('/login')
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
:deep(.custom-input .t-input__wrap) {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 52px;
}

:deep(.custom-input .t-input__wrap:hover) {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

:deep(.custom-input .t-input__wrap.t-is-focused) {
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

:deep(.custom-input .t-input__inner) {
  font-size: 16px;
  color: #1f2937;
}

:deep(.custom-input .t-input__prefix) {
  color: #64748b;
  margin-left: 12px;
}

.register-btn {
  border-radius: 12px !important;
  font-weight: 600 !important;
  height: 52px !important;
  font-size: 16px !important;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border: none !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
}

.register-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4) !important;
}

.register-btn:active {
  transform: translateY(0) !important;
}

.register-btn:deep(.t-icon) {
  margin-right: 8px;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .text-center h2 {
    font-size: 32px;
  }
  
  :deep(.custom-input .t-input__inner) {
    height: 48px;
  }
  
  .register-btn {
    height: 48px !important;
  }
}

/* 动画效果 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.w-20.h-20 {
  animation: float 3s ease-in-out infinite;
}
</style>