import { call, put, select } from 'redux-saga/effects'
import SubscriptionFormsActions from '../Redux/SubscriptionForms'

export function * fetchSubscriptionForms (api, { payload }) {
  const alreadyFetched = yield select(state => state.subscriptionForms.fetched)
  const isWholeDataSet = yield select(state => state.subscriptionForms.isWholeDataSet)

  // if not first request and not whole match set and no payload is given, use the redux stored payload
  if (payload === undefined && alreadyFetched && !isWholeDataSet) {
    payload = yield select(state => state.subscriptionForms.qs)
  }

  const { filters, ...rest } = payload || {}

  // request
  const response = yield call(api.subscriptionForms, { ...rest, ...filters })

  // success?
  if (response.ok) {
    yield put(SubscriptionFormsActions.subscriptionFormsSuccess(response.data))
  } else {
    yield put(SubscriptionFormsActions.subscriptionFormsFailure({
      code: response.status,
      detail: response.data.detail
    }))
  }
}

export function * requestSubscriptionForms (api) {
  const isWholeDataSet = yield select(state => state.subscriptionForms.isWholeDataSet)
  // update data if not whole data set
  if (!isWholeDataSet) {
    yield put(SubscriptionFormsActions.subscriptionFormsRequest())
  }
}
