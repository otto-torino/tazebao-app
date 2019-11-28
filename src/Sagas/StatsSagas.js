import { call, put, select } from 'redux-saga/effects'
import StatsActions from '../Redux/Stats'
import history from '../history'
import config from '../Config'

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
