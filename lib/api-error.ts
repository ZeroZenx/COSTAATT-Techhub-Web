export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown): { status: number; message: string } {
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      message: error.message,
    }
  }

  if (error instanceof Error) {
    console.error('API Error:', error)
    return {
      status: 500,
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message,
    }
  }

  return {
    status: 500,
    message: 'An unexpected error occurred',
  }
}

