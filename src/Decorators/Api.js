import { toast } from 'react-toastify'

// just a decorator which calls given function if response is ok,
// otherwise shows a toast with error information
export function toastOnError (fn, errorMessage, onError = () => {}) {
  return response => {
    if (response.ok) {
      fn(response)
    } else {
      toast(errorMessage.replace('{error}', response.data.detail), { type: 'error' })
      onError(response.data.detail)
    }
  }
}
