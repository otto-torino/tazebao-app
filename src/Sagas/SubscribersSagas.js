import { call, put, select } from 'redux-saga/effects'
import SubscribersActions from '../Redux/Subscribers'
import history from '../history'
import config from '../Config'

export function * fetchSubscribers (api, { payload }) {
  // request
  const response = yield call(api.subscribers)

  // success?
  if (response.ok) {
    yield put(SubscribersActions.subscribersSuccess(response.data))
  } else {
    yield put(SubscribersActions.subscribersFailure({ code: response.status, detail: response.data.detail }))
  }
}

