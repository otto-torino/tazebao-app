import { call, put } from 'redux-saga/effects'
import SubscribersActions from '../Redux/Subscribers'

export function * fetchSubscribers (api, { payload }) {
  console.log(payload, 'PAYLOAD')
  // request
  const response = yield call(api.subscribers, payload)

  // success?
  if (response.ok) {
    yield put(SubscribersActions.subscribersSuccess(response.data))
  } else {
    yield put(SubscribersActions.subscribersFailure({ code: response.status, detail: response.data.detail }))
  }
}

