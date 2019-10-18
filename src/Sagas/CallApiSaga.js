import { put } from 'redux-saga/effects'
import history from '../history'
import AuthActions from '../Redux/Auth'

// this saga is used for redirecting to the LoginView when a 401 error is received
export function * callApi (apiCall) {
  const response = yield apiCall

  if (!isBadToken(response)) {
    return response
  }
  // this triggers your UI to show a login form
  console.log('BAD token, redirecting to login')
  // reset auth state, user is not logged, has a bad token
  yield put(AuthActions.reset())
  history.push('/login')
  return response
}

function isBadToken (resp) {
  return resp.status === 401
}
