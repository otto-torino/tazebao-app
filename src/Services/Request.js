import { api } from '../Sagas'
import { toast } from 'react-toastify'
import { toastOnError } from '../Decorators/Api'

export function request (endpoint, args, errorMessage, onSuccess, onError) {
  return api[endpoint](...args)
    .then(toastOnError(response => {
      onSuccess(response)
    }, errorMessage, onError))
    .catch(error => {
      toast(errorMessage.replace('{error}', error), { type: 'error' })
      onError && onError(error)
    })
}

export function backgroundRequest (endpoint, args) {
  return api[endpoint](...args)
}

export function djangoSaucePageRequest (endpoint, pageSize) {
  return async function (next) {
    const response = await backgroundRequest(endpoint, [next, pageSize])
    const data = response.data.results
    next = response.data.next
    next = next ? (new URL(next)).searchParams.get('page') : null
    return { data, next }
  }
}
