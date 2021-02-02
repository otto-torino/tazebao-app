import { call, put, select } from 'redux-saga/effects'
import BouncesActions from '../Redux/Bounces'

export function * fetchBounces (api, { payload }) {
  const alreadyFetched = yield select(state => state.bounces.fetched)
  const isWholeDataSet = yield select(state => state.bounces.isWholeDataSet)

  // if not first request and not whole match set and no payload is given, use the redux stored payload
  if (payload === undefined && alreadyFetched && !isWholeDataSet) {
    payload = yield select(state => state.bounces.qs)
  }

  const { filters, ...rest } = payload || {}

  // request
  const response = yield call(api.bounces, { ...rest, ...filters })

  // success?
  if (response.ok) {
    yield put(BouncesActions.bouncesSuccess(response.data))
  } else {
    yield put(BouncesActions.bouncesFailure({ code: response.status, detail: response.data.detail }))
  }
}

export function * requestBounces (api) {
  const isWholeDataSet = yield select(state => state.bounces.isWholeDataSet)
  // update data if not whole data set
  if (!isWholeDataSet) {
    yield put(BouncesActions.bouncesRequest())
  }
}
