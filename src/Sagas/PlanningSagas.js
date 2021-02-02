import { call, put, select } from 'redux-saga/effects'
import PlanningActions from '../Redux/Planning'

export function * fetchPlanning (api, { payload }) {
  const alreadyFetched = yield select(state => state.planning.fetched)
  const isWholeDataSet = yield select(state => state.planning.isWholeDataSet)

  // if not first request and not whole match set and no payload is given, use the redux stored payload
  if (payload === undefined && alreadyFetched && !isWholeDataSet) {
    payload = yield select(state => state.planning.qs)
  }

  const { filters, ...rest } = payload || {}

  // request
  const response = yield call(api.planning, { ...rest, ...filters })

  // success?
  if (response.ok) {
    yield put(PlanningActions.planningSuccess(response.data))
  } else {
    yield put(PlanningActions.planningFailure({ code: response.status, detail: response.data.detail }))
  }
}

export function * requestPlanning (api) {
  const isWholeDataSet = yield select(state => state.planning.isWholeDataSet)
  // update data if not whole data set
  if (!isWholeDataSet) {
    yield put(PlanningActions.planningRequest())
  }
}
