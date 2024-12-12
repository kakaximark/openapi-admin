import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginForm, LoginResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<any>(null)

  // 简化的 token 验证
  const validateToken = () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      return true
    }
    return false
  }

  const login = async (loginForm: LoginForm) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm)
      })

      if (!response.ok) {
        throw new Error('登录失败')
      }

      const result = await response.json() as LoginResponse
      
      if (result.code !== 200 || !result.data.token) {
        throw new Error(result.message || '登录失败')
      }

      // 保存登录状态
      token.value = result.data.token
      
      // 保存到 localStorage
      localStorage.setItem('token', result.data.token)
      
      return result.data
    } catch (error) {
      console.error('Login failed:', error)
      logout()
      throw error
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 初始化时直接验证 token
  const initialize = () => {
    validateToken()
  }

  return {
    token,
    user,
    login,
    logout,
    initialize,
    validateToken
  }
}) 