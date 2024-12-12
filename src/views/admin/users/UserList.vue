<template>
  <div class="user-list">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>
            <router-link :to="`/admin/users/edit/${user.id}`">编辑</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const users = [
  { id: 1, username: 'admin' },
  { id: 2, username: 'user1' }
]
</script> 