import { call, put, select } from 'redux-saga/effects'
import StartupActions from '../Redux/Startup'
import AuthActions from '../Redux/Auth'
import history from '../history'
import config from '../Config'

export const selectAuthToken = state => state.auth.token

// attempts to login
export function * login (api, { payload }) {
  // request
  const response = yield call(api.login, payload.username, payload.password)

  // success?
  if (response.ok) {
    // set token in the api requests header
    yield call(api.setAuthToken, response.data.data.token)
    // store auth data in redux store
    yield put(AuthActions.loginSuccess(response.data.data))
    yield put(AuthActions.whoamiRequest())
  } else {
    yield put(AuthActions.loginFailure({ code: response.status, message: 'Wrong username or password' }))
  }
}

export function * logout () {
  yield history.push(config.urls.login)
}

// refresh token
export function * refresh (api) {
  // get refresh token
  const refreshToken = yield select(state => state.auth.refreshToken)
  const email = yield select(state => state.auth.user.email)
  // request
  const response = yield call(api.refresh, email, refreshToken)

  // success?
  if (response.ok) {
    // set token in the api requests header
    yield call(api.setAuthToken, response.data.data.token)
    yield put(AuthActions.refreshSuccess(response.data.data))
  } else {
    yield put(AuthActions.refreshFailure({ code: response.status, message: response.data.message }))
  }
}

// whoami?
export function * whoami ({ api, dispatch }) {
  // request
  const response = yield call(api.whoami)

  // success?
  if (response.ok) {
    // store whoami data in redux store
    yield put(AuthActions.whoamiSuccess(response.data.data))
    const isAuthenticated = yield select(state => state.auth.isAuthenticated)
    const startupComplete = yield select(state => state.startup.complete)
    if (isAuthenticated) {
      // set refresh token
      const refresh = () => {
        dispatch(AuthActions.refreshRequest())
      }
      setInterval(refresh, config.refreshTokenInterval)
      // goto page user was trying to access, if any
      let redirectUrl
      try {
        redirectUrl = yield select(
          state => state.router.location.state.from.pathname
        )
      } catch (e) {
        redirectUrl = config.urls.home
      }
      history.push(redirectUrl)
      if (!startupComplete) {
        yield put(StartupActions.startupComplete())
      }
    }
  } else {
    yield put(StartupActions.startupComplete())
  }
}
