<template>
  <div class="users-container">
    <div class="users-header">
      <h2>用户管理</h2>
      <nav class="users-nav">
        <router-link to="/admin/users/list">用户列表</router-link>
        <!-- <router-link to="/admin/users/add">添加用户</router-link> -->
      </nav>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.users-container {
  padding: 20px;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.users-nav {
  display: flex;
  gap: 20px;
}

.users-nav a {
  padding: 8px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
}

.users-nav a.router-link-active {
  color: #409eff;
  background: #ecf5ff;
}
</style> 