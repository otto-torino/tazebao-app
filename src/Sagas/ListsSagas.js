import { call, put, select } from 'redux-saga/effects'
import ListsActions from '../Redux/Lists'
import history from '../history'
import config from '../Config'

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
