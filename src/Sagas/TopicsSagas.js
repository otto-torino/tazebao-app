import { call, put } from 'redux-saga/effects'
import TopicsActions from '../Redux/Topics'

export function * fetchTopics (api, { payload }) {
  // request
  const response = yield call(api.topics)
  // success?
  if (response.ok) {
    yield put(TopicsActions.topicsSuccess(response.data))
  } else {
    yield put(TopicsActions.topicsFailure({ code: response.status, detail: response.data.detail }))
  }
}
