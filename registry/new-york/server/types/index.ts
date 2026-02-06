// GHL Types - Main Export
export * from "./contact"
export * from "./opportunity"
export * from "./calendar"
export * from "./conversation"
export * from "./webhook"
export * from "./oauth"

export interface GHLPaginatedResponse<T> {
  data: T[]
  meta: {
    startAfter?: number
    startAfterId?: string
    total?: number
    currentPage?: number
    nextPage?: number
    prevPage?: number
  }
}

export interface GHLApiError {
  statusCode: number
  message: string
  error?: string
}

export interface GHLSuccessResponse<T> {
  success: boolean
  data: T
}

export interface GHLConfig {
  baseUrl: string
  version: string
}

export const GHL_API_BASE_URL = "https://services.leadconnectorhq.com"
export const GHL_API_VERSION = "2021-07-28"
