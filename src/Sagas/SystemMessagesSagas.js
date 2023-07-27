import { call, put } from 'redux-saga/effects'
import SystemMessagesActions from '../Redux/SystemMessages'

export function * fetchSystemMessages (api, { payload }) {
  // request
  const response = yield call(api.systemMessages)

  // success?
  if (response.ok) {
    yield put(SystemMessagesActions.systemMessagesSuccess(response.data))
  } else {
    yield put(SystemMessagesActions.systemMessagesFailure({ code: response.status, detail: response.data.detail }))
  }
}
