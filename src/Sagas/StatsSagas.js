import { call, put } from 'redux-saga/effects'
import StatsActions from '../Redux/Stats'

export function * fetchStats (api, { payload }) {
  // request
  const response = yield call(api.stats)

  // success?
  if (response.ok) {
    yield put(StatsActions.statsSuccess(response.data))
  } else {
    yield put(StatsActions.statsFailure({ code: response.status, detail: response.data.detail }))
  }
}
