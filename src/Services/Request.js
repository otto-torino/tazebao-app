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
