import { call, put, select } from 'redux-saga/effects'
import BouncesActions from '../Redux/Bounces'
import history from '../history'
import config from '../Config'

export function * fetchBounces (api, { payload }) {
  // request
  const response = yield call(api.bounces)

  // success?
  if (response.ok) {
    yield put(BouncesActions.bouncesSuccess(response.data))
  } else {
    yield put(BouncesActions.bouncesFailure({ code: response.status, detail: response.data.detail }))
  }
}
