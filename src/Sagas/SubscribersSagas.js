import { call, put, select } from 'redux-saga/effects'
import SubscribersActions from '../Redux/Subscribers'

export function * fetchSubscribers (api, { payload }) {
  const alreadyFetched = yield select(state => state.subscribers.fetched)
  const isWholeDataSet = yield select(state => state.subscribers.isWholeDataSet)

  // if not first request and not whole match set and no payload is given, use the redux stored payload
  if (payload === undefined && alreadyFetched && !isWholeDataSet) {
    payload = yield select(state => state.subscribers.qs)
  }

  const { filters, ...rest } = payload || {}

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
  const isWholeDataSet = yield select(state => state.subscribers.isWholeDataSet)
  // update data if not whole data set
  if (!isWholeDataSet) {
    yield put(SubscribersActions.subscribersRequest())
  }
}
