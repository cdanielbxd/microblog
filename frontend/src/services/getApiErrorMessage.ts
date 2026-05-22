import axios from 'axios'

export function getApiErrorMessage(error: unknown, defaultMessage: string) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Nao foi possivel conectar ao backend em http://localhost:3333. Verifique se a API esta rodando.'
    }

    const apiMessage = error.response?.data?.message
    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage
    }
  }

  return defaultMessage
}
