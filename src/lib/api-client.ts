/**
 * API Client with Automatic Retry and Error Handling
 *
 * Features:
 * - Automatic retry on failure (configurable attempts)
 * - Exponential backoff between retries
 * - Request timeout handling
 * - Error classification (retry-able vs not)
 * - Detailed error logging
 */

export interface ApiClientOptions {
  maxRetries?: number // Default: 3
  timeout?: number // Default: 30000ms (30 seconds)
  retryDelay?: number // Default: 1000ms (1 second)
  backoffMultiplier?: number // Default: 2 (exponential backoff)
  onRetry?: (attempt: number, error: Error) => void
}

export interface ApiResponse<T = unknown> {
  ok: boolean
  status: number
  data?: T
  error?: string
}

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Check if an error is retry-able
 */
const isRetryableError = (status: number): boolean => {
  // Retry on:
  // - 408 Request Timeout
  // - 429 Too Many Requests
  // - 500 Internal Server Error
  // - 502 Bad Gateway
  // - 503 Service Unavailable
  // - 504 Gateway Timeout
  // - Network errors (status 0)
  return (
    status === 0 || // Network error
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  )
}

/**
 * Fetch with timeout
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if ((error as Error).name === "AbortError") {
      throw new Error("Request timeout")
    }
    throw error
  }
}

/**
 * API Client with retry logic
 */
export class ApiClient {
  private options: Required<ApiClientOptions>

  constructor(options: ApiClientOptions = {}) {
    this.options = {
      maxRetries: options.maxRetries ?? 3,
      timeout: options.timeout ?? 30000,
      retryDelay: options.retryDelay ?? 1000,
      backoffMultiplier: options.backoffMultiplier ?? 2,
      onRetry: options.onRetry ?? (() => {}),
    }
  }

  /**
   * Make a request with automatic retry
   */
  async request<T = unknown>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null
    let attempt = 0

    while (attempt <= this.options.maxRetries) {
      try {
        // Make the request with timeout
        const response = await fetchWithTimeout(
          url,
          options,
          this.options.timeout
        )

        // If successful, parse and return
        if (response.ok) {
          let data: T | undefined
          const contentType = response.headers.get("content-type")

          if (contentType && contentType.includes("application/json")) {
            data = await response.json()
          }

          return {
            ok: true,
            status: response.status,
            data,
          }
        }

        // If error is not retry-able, return immediately
        if (!isRetryableError(response.status)) {
          let errorMessage = `Request failed with status ${response.status}`
          try {
            const errorData = await response.json()
            if (errorData.error) {
              errorMessage = errorData.error
            }
          } catch {
            // Ignore JSON parse errors
          }

          return {
            ok: false,
            status: response.status,
            error: errorMessage,
          }
        }

        // Store error for potential retry
        lastError = new Error(`HTTP ${response.status}`)
      } catch (error) {
        // Network error or timeout
        lastError = error as Error
        console.error(`Request attempt ${attempt + 1} failed:`, lastError)
      }

      // If we've exhausted retries, return the error
      if (attempt >= this.options.maxRetries) {
        return {
          ok: false,
          status: 0,
          error: lastError?.message || "Request failed after all retries",
        }
      }

      // Calculate delay with exponential backoff
      const delay =
        this.options.retryDelay *
        Math.pow(this.options.backoffMultiplier, attempt)

      // Notify about retry
      attempt++
      this.options.onRetry(attempt, lastError!)
      console.log(
        `Retrying request (attempt ${attempt}/${this.options.maxRetries}) after ${delay}ms...`
      )

      // Wait before retrying
      await sleep(delay)
    }

    // Should never reach here, but TypeScript needs it
    return {
      ok: false,
      status: 0,
      error: "Unexpected error in retry logic",
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "GET" })
  }

  /**
   * POST request
   */
  async post<T = unknown>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  async put<T = unknown>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "DELETE" })
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient()

/**
 * Create a custom API client with specific options
 */
export const createApiClient = (options: ApiClientOptions): ApiClient => {
  return new ApiClient(options)
}

/**
 * Helper to check if online
 */
export const isOnline = (): boolean => {
  return typeof navigator !== "undefined" && navigator.onLine
}

/**
 * Helper to wait for online status
 */
export const waitForOnline = (): Promise<void> => {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve()
      return
    }

    const handleOnline = () => {
      window.removeEventListener("online", handleOnline)
      resolve()
    }

    window.addEventListener("online", handleOnline)
  })
}
