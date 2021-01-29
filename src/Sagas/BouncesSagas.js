import { call, put } from 'redux-saga/effects'
import BouncesActions from '../Redux/Bounces'

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
