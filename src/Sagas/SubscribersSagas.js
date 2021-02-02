import { call, put, select } from 'redux-saga/effects'
import SubscribersActions from '../Redux/Subscribers'

export function * fetchSubscribers (api, { payload }) {
  if (payload === undefined) {
    payload = yield select(state => state.subscribers.qs)
  }

  const { filters, ...rest } = payload
  // request
  const response = yield call(api.subscribers, { ...rest, ...filters })

  // success?
  if (response.ok) {
    yield put(SubscribersActions.subscribersSuccess(response.data))
  } else {
    yield put(SubscribersActions.subscribersFailure({ code: response.status, detail: response.data.detail }))
  }
}

export function * requestSubscribers (api) {
  yield put(SubscribersActions.subscribersRequest())
}
