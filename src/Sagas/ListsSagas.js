import { call, put } from 'redux-saga/effects'
import ListsActions from '../Redux/Lists'

export function * fetchLists (api, { payload }) {
  // request
  const response = yield call(api.lists)

  // success?
  if (response.ok) {
    yield put(ListsActions.listsSuccess(response.data))
  } else {
    yield put(ListsActions.listsFailure({ code: response.status, detail: response.data.detail }))
  }
}
