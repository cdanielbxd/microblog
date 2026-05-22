import axios from 'axios'

export function getApiErrorMessage(error: unknown, defaultMessage: string) {
  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.message
    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage
    }
  }

  return defaultMessage
}
