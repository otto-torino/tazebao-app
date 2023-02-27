import { call, put } from 'redux-saga/effects'
import SubscriptionsStatisticsActions from '../Redux/SubscriptionsStatistics'

export function * fetchSubscriptionsStatistics (api, { payload }) {
  // request
  const response = yield call(api.subscriptionsStatistics)

  // success?
  if (response.ok) {
    yield put(SubscriptionsStatisticsActions.subscriptionsStatisticsSuccess(response.data))
  } else {
    yield put(SubscriptionsStatisticsActions.subscriptionsStatisticsFailure({
      code: response.status, detail: response.data.detail
    }))
  }
}
