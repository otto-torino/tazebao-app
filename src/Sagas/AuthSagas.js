import { call, put, select } from 'redux-saga/effects'
import StartupActions from '../Redux/Startup'
import AuthActions from '../Redux/Auth'
import SubscribersActions from '../Redux/Subscribers'
import ListsActions from '../Redux/Lists'
import TopicsActions from '../Redux/Topics'
import CampaignsActions from '../Redux/Campaigns'
import history from '../history'
import config from '../Config'

export const selectAuthToken = state => state.auth.token

// attempts to login
export function * login (api, { payload }) {
  // request
  const response = yield call(api.login, payload.username, payload.password)

  console.log(response)

  // success?
  if (response.ok) {
    // set token in the api requests header
    yield call(api.setAuthToken, response.data.token)
    // store auth data in redux store
    yield put(AuthActions.loginSuccess(response.data))
    yield put(AuthActions.whoamiRequest())
  } else {
    yield put(AuthActions.loginFailure({ code: response.status, detail: 'Wrong username or password' }))
  }
}

export function * logout () {
  yield history.push(config.urls.login)
}

// refresh token
export function * refresh (api) {
  // get refresh token
  const token = yield select(state => state.auth.token)
  // const email = yield select(state => state.auth.user.email)
  // request
  const response = yield call(api.refresh, token)

  // success?
  if (response.ok) {
    // set token in the api requests header
    yield call(api.setAuthToken, response.data.token)
    yield put(AuthActions.refreshSuccess(response.data))
  } else {
    yield put(AuthActions.refreshFailure({ code: response.status, detail: 'Error refreshing token' }))
  }
}

// whoami?
export function * whoami ({ api, dispatch }) {
  // request
  const response = yield call(api.whoami)

  // success?
  if (response.ok) {
    // store whoami data in redux store
    yield put(AuthActions.whoamiSuccess(response.data))
    const isAuthenticated = yield select(state => state.auth.isAuthenticated)
    const startupComplete = yield select(state => state.startup.complete)
    if (isAuthenticated) {
      //  set refresh token
      const refresh = () => {
        dispatch(AuthActions.refreshRequest())
      }
      setInterval(refresh, config.refreshTokenInterval) // @TODO
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
      yield put(ListsActions.listsRequest())
      yield put(SubscribersActions.subscribersRequest())
      yield put(TopicsActions.topicsRequest())
      yield put(CampaignsActions.campaignsRequest())
      if (!startupComplete) {
        yield put(StartupActions.startupComplete())
      }
    }
  } else {
    yield put(StartupActions.startupComplete())
  }
}
