<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>后台管理系统</h1>
      <div class="user-info">
        <span>欢迎, {{ authStore.user?.username }}</span>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
      </div>
    </header>
    
    <div class="admin-content">
      <aside class="admin-sidebar">
        <nav>
          <ul>
            <li class="nav-item">
              <div class="nav-link" @click="toggleDashboard">
                <span>控制台</span>
                <i class="arrow" :class="{ 'arrow-down': isDashboardOpen }"></i>
              </div>
              <ul class="sub-menu" v-show="isDashboardOpen">
                <li><router-link to="/admin/dashboard/overview">函数计算</router-link></li>
                <li><router-link to="/admin/dashboard/analysis">cloudflare</router-link></li>
              </ul>
            </li>
            <li><router-link to="/admin/users/list">用户管理</router-link></li>
            <li><router-link to="/admin/settings/profile">系统设置</router-link></li>
          </ul>
        </nav>
      </aside>
      
      <main class="admin-main">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isDashboardOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const toggleDashboard = () => {
  isDashboardOpen.value = !isDashboardOpen.value
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #f78989;
}

.admin-content {
  flex: 1;
  display: flex;
  background: #f5f7f9;
}

.admin-sidebar {
  width: 200px;
  background: #304156;
  padding: 1rem 0;
}

.admin-sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin-sidebar nav a {
  display: block;
  padding: 0.8rem 1.5rem;
  color: #bfcbd9;
  text-decoration: none;
  transition: all 0.3s;
}

.admin-sidebar nav a:hover,
.admin-sidebar nav a.router-link-active {
  color: #fff;
  background: #263445;
}

.admin-main {
  flex: 1;
  padding: 2rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: #bfcbd9;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-link:hover {
  color: #fff;
  background: #263445;
}

.arrow {
  border: solid #bfcbd9;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
  transition: transform 0.3s;
}

.arrow-down {
  transform: rotate(45deg);
}

.sub-menu {
  padding-left: 1rem;
  background: #113d70;
}

.sub-menu a {
  padding: 0.6rem 1.5rem;
  font-size: 0.8rem;
}

.sub-menu a.router-link-active {
  color: #087cf0;
  background: transparent;
}
</style> 