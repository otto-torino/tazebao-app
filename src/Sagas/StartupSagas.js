import { put, select, call } from 'redux-saga/effects'
import AuthActions from '../Redux/Auth'
import SystemMessagaesActions from '../Redux/SystemMessages'

// process STARTUP actions
export function * startup (api, action) {
  // load the token saved in the redux store
  const token = yield select(state => state.auth.token)
  // only set the token in api headers if we have it
  if (token) {
    yield call(api.setAuthToken, token)
  }
  yield put(AuthActions.whoamiRequest())
  yield put(SystemMessagaesActions.systemMessagesRequest())
}
