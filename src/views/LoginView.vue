<template>
    <div class="login-container">
      <div class="login-box">
        <h2>系统登录</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-item">
            <input 
              type="text" 
              v-model="loginForm.username" 
              placeholder="用户名"
              required
            >
          </div>
          <div class="form-item">
            <input 
              type="password" 
              v-model="loginForm.password" 
              placeholder="密码"
              required
            >
          </div>
          <button type="submit" class="login-button">登录</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const loginForm = ref({
    username: '',
    password: ''
  })
  
  const errorMessage = ref('')
  const isLoading = ref(false)
  
  const handleLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true
    
    try {
      await authStore.login(loginForm.value)
      router.push('/admin/dashboard')
    } catch (error) {
      errorMessage.value = error instanceof Error 
        ? error.message 
        : '登录失败，请稍后重试'
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: pink; */
  }
  
  .login-box {
    width: 400px;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }
  
  .form-item {
    margin-bottom: 20px;
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  input:focus {
    outline: none;
    border-color: #409eff;
  }
  
  .login-button {
    width: 100%;
    padding: 12px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .login-button:hover {
    background-color: #66b1ff;
  }
  </style>