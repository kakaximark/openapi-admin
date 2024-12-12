export interface LoginForm {
  username: string
  password: string
}

export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface LoginResponseData {
  token: string
  user?: any  // 如果后端返回用户信息，可以定义具体类型
}

export type LoginResponse = ApiResponse<LoginResponseData> 