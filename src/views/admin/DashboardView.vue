<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2>控制台</h2>
      <nav class="dashboard-nav">
        <router-link to="/admin/dashboard/overview">函数计算</router-link>
        <router-link to="/admin/dashboard/analysis">cloudflare</router-link>
      </nav>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-nav {
  display: flex;
  gap: 20px;
}

.dashboard-nav a {
  padding: 8px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
}

.dashboard-nav a.router-link-active {
  color: #409eff;
  background: #ecf5ff;
}
</style> 