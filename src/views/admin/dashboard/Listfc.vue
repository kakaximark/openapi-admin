<template>
  <div class="fc-list">
    <div class="list-header">
      <h3>函数计算服务列表</h3>
      <div class="refresh-btn" @click="fetchServices">
        <span>刷新</span>
      </div>
    </div>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="service-list">
      <table>
        <thead>
          <tr>
            <th>服务名称</th>
            <th>描述</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.serviceName">
            <td>{{ service.serviceName }}</td>
            <td>{{ service.description }}</td>
            <td class="actions">
              <button class="action-btn" @click="handleView(service)">查看</button>
              <button class="action-btn" @click="handleEdit(service)">编辑</button>
              <button class="action-btn publish-btn" @click="showPublishDialog(service)">发布</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 版本信息对话框 -->
    <div v-if="showVersions" class="dialog-overlay">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ currentService?.serviceName }} - 版本列表</h3>
          <button class="close-btn" @click="closeVersionDialog">×</button>
        </div>
        
        <div v-if="loadingVersions" class="loading">
          加载中...
        </div>
        
        <div v-else-if="versionError" class="error">
          {{ versionError }}
        </div>
        
        <div v-else class="version-list">
          <table>
            <thead>
              <tr>
                <th>版本号</th>
                <th>描述</th>
                <th>创建时间</th>
                <th>最后修改</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="version in versions" :key="version.versionId">
                <td>{{ version.versionId }}</td>
                <td>{{ version.description }}</td>
                <td>{{ formatDate(version.createdTime) }}</td>
                <td>{{ formatDate(version.lastModifiedTime) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 发布对话框 -->
    <div v-if="showPublish" class="dialog-overlay">
      <div class="dialog-content publish-dialog">
        <div class="dialog-header">
          <h3>发布服务 - {{ currentService?.serviceName }}</h3>
          <button class="close-btn" @click="closePublishDialog">×</button>
        </div>
        
        <div class="publish-form">
          <div class="form-item">
            <label>发布描述：</label>
            <input 
              v-model="publishDescription" 
              type="text" 
              placeholder="请输入发布描述"
              :disabled="publishing"
            >
          </div>
          
          <div class="form-actions">
            <button 
              class="action-btn publish-submit" 
              @click="handlePublish"
              :disabled="publishing || !publishDescription.trim()"
            >
              {{ publishing ? '发布中...' : '确认发布' }}
            </button>
          </div>

          <div v-if="publishError" class="error">
            {{ publishError }}
          </div>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="showMessage" class="message-popup" :class="messageType">
      <div class="message-content">
        <span>{{ messageText }}</span>
        <button class="message-close" @click="closeMessage">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Service {
  serviceName: string
  description: string
}

interface ApiResponse {
  code: number
  data: {
    services: Service[]
  }
  message: string
}

interface Version {
  versionId: string
  description: string
  createdTime: string
  lastModifiedTime: string
}

interface VersionResponse {
  code: number
  data: {
    versions: Version[]
  }
  message: string
}

interface PublishResponse {
  code: number
  data: {
    versionId: string
    description: string
    createdTime: string
    lastModifiedTime: string
  }
  message: string
}

const authStore = useAuthStore()
const services = ref<Service[]>([])
const loading = ref(false)
const error = ref('')
const showVersions = ref(false)
const versions = ref<Version[]>([])
const loadingVersions = ref(false)
const versionError = ref('')
const currentService = ref<Service | null>(null)

// 发布相关的状态
const showPublish = ref(false)
const publishDescription = ref('')
const publishing = ref(false)
const publishError = ref('')

// 消息提示相关的状态
const showMessage = ref(false)
const messageText = ref('')
const messageType = ref<'success' | 'error'>('success')

const fetchServices = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch('http://localhost:8080/api/v1/services', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!response.ok) {
      throw new Error('获取服务列表失败')
    }

    const result = await response.json() as ApiResponse
    if (result.code === 200) {
      services.value = result.data.services
    } else {
      throw new Error(result.message || '获取服务列表失败')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取服务列表失败'
  } finally {
    loading.value = false
  }
}

const handleView = async (service: Service) => {
  currentService.value = service
  showVersions.value = true
  loadingVersions.value = true
  versionError.value = ''
  
  try {
    const response = await fetch(`http://localhost:8080/api/v1/services/${service.serviceName}/versions`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!response.ok) {
      throw new Error('获取版本列表失败')
    }

    const result = await response.json() as VersionResponse
    if (result.code === 200) {
      versions.value = result.data.versions
    } else {
      throw new Error(result.message || '获取版本列表失败')
    }
  } catch (err) {
    versionError.value = err instanceof Error ? err.message : '获取版本列表失败'
  } finally {
    loadingVersions.value = false
  }
}

const handleEdit = (service: Service) => {
  console.log('编辑服务:', service.serviceName)
  // 实现编辑功能
}

const closeVersionDialog = () => {
  showVersions.value = false
  versions.value = []
  currentService.value = null
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

// 显示发布对话框
const showPublishDialog = (service: Service) => {
  currentService.value = service
  showPublish.value = true
  publishDescription.value = ''
  publishError.value = ''
}

// 关闭发布对话框
const closePublishDialog = () => {
  showPublish.value = false
  currentService.value = null
  publishDescription.value = ''
  publishError.value = ''
  publishing.value = false
}

// 处理发布请求
const handlePublish = async () => {
  if (!currentService.value || !publishDescription.value.trim()) return
  
  publishing.value = true
  publishError.value = ''
  
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/services/${currentService.value.serviceName}/publishservice`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: publishDescription.value.trim()
        })
      }
    )

    if (!response.ok) {
      throw new Error('发布服务失败')
    }

    const result = await response.json() as PublishResponse
    if (result.code === 200) {
      closePublishDialog()
      await fetchServices()
      showMessagePopup(
        `服务发布成功！\n版本号: ${result.data.versionId}\n描述: ${result.data.description}`,
        'success'
      )
    } else {
      throw new Error(result.message)
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : '发布服务失败'
    publishError.value = errorMsg
    showMessagePopup(errorMsg, 'error')
  } finally {
    publishing.value = false
  }
}

// 显示消息提示
const showMessagePopup = (text: string, type: 'success' | 'error' = 'success') => {
  messageText.value = text
  messageType.value = type
  showMessage.value = true
  // 3秒后自动关闭
  setTimeout(() => {
    closeMessage()
  }, 3000)
}

const closeMessage = () => {
  showMessage.value = false
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.fc-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.refresh-btn {
  padding: 6px 12px;
  background: #f4f4f5;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-btn:hover {
  background: #e9e9eb;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #f56c6c;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

th {
  background-color: #f5f7fa;
  color: #909399;
  font-weight: 500;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.status.running {
  background: #e1f3d8;
  color: #67c23a;
}

.status.stopped {
  background: #fde2e2;
  color: #f56c6c;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  width: 80%;
  max-width: 1000px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
}

.close-btn:hover {
  color: #409eff;
}

.version-list {
  margin-top: 20px;
}

.version-list table {
  width: 100%;
}

.version-list th, .version-list td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.version-list th {
  background-color: #f5f7fa;
  color: #909399;
  font-weight: 500;
}

.publish-btn {
  background: #67c23a;
  color: white;
  border: none;
}

.publish-btn:hover {
  background: #85ce61;
  color: white;
}

.publish-dialog {
  max-width: 500px;
}

.publish-form {
  padding: 20px 0;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
}

.form-item input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-item input:focus {
  outline: none;
  border-color: #409eff;
}

.form-item input:disabled {
  background: #f5f7fa;
  cursor: not-allowed;
}

.form-actions {
  text-align: right;
  margin-top: 20px;
}

.publish-submit {
  padding: 8px 20px;
  background: #409eff;
  color: white;
  border: none;
}

.publish-submit:hover:not(:disabled) {
  background: #66b1ff;
}

.publish-submit:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.message-popup {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  padding: 15px 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease-out;
  white-space: pre-line;
  min-width: 300px;
}

.message-popup.success {
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
  color: #67c23a;
}

.message-popup.error {
  background: #fef0f0;
  border: 1px solid #fde2e2;
  color: #f56c6c;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.message-content span {
  display: block;
  line-height: 1.5;
}

.message-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0 0 0 10px;
  color: inherit;
  opacity: 0.8;
}

.message-close:hover {
  opacity: 1;
}

@keyframes slideDown {
  from {
    transform: translate(-50%, -20px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style> 