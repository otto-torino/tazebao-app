import { call, put } from 'redux-saga/effects'
import PlanningActions from '../Redux/Planning'

export function * fetchPlanning (api, { payload }) {
  // request
  const response = yield call(api.planning)

  // success?
  if (response.ok) {
    yield put(PlanningActions.planningSuccess(response.data))
  } else {
    yield put(PlanningActions.planningFailure({ code: response.status, detail: response.data.detail }))
  }
}
