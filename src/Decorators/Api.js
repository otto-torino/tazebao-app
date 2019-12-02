import { toast } from 'react-toastify'

// just a decorator which calls given function if response is ok,
// otherwise shows a toast with error information
export function toastOnError (fn, errorMessage, onError = () => {}) {
  return response => {
    if (response.ok) {
      fn(response)
    } else {
      if (response.data.detail) {
        toast(errorMessage.replace('{error}', response.data.detail), { type: 'error' })
      } else {
        let str = ''
        Object.keys(response.data).forEach(k => {
          str += `${k} > ${response.data[k]};`
        })
        toast(errorMessage.replace('{error}', str), { type: 'error' })
      }
      onError(response.data.detail)
    }
  }
}
