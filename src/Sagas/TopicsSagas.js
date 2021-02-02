import { call, put, select } from 'redux-saga/effects'
import TopicsActions from '../Redux/Topics'

export function * fetchTopics (api, { payload }) {
  const alreadyFetched = yield select(state => state.topics.fetched)
  const isWholeDataSet = yield select(state => state.topics.isWholeDataSet)

  // if not first request and not whole match set and no payload is given, use the redux stored payload
  if (payload === undefined && alreadyFetched && !isWholeDataSet) {
    payload = yield select(state => state.topics.qs)
  }

  const { filters, ...rest } = payload || {}

  // request
  const response = yield call(api.topics, { ...rest, ...filters })

  // success?
  if (response.ok) {
    yield put(TopicsActions.topicsSuccess(response.data))
  } else {
    yield put(TopicsActions.topicsFailure({ code: response.status, detail: response.data.detail }))
  }
}

export function * requestsTopics (api) {
  const isWholeDataSet = yield select(state => state.topics.isWholeDataSet)
  // update data if not whole data set
  if (!isWholeDataSet) {
    yield put(TopicsActions.topicsRequest())
  }
}
