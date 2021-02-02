import { call, put, select } from 'redux-saga/effects'
import ListsActions from '../Redux/Lists'

export function * fetchLists (api, { payload }) {
  const alreadyFetched = yield select(state => state.lists.fetched)
  const isWholeDataSet = yield select(state => state.lists.isWholeDataSet)

  // if not first request and not whole match set and no payload is given, use the redux stored payload
  if (payload === undefined && alreadyFetched && !isWholeDataSet) {
    payload = yield select(state => state.lists.qs)
  }

  const { filters, ...rest } = payload || {}

  // request
  const response = yield call(api.lists, { ...rest, ...filters })

  // success?
  if (response.ok) {
    yield put(ListsActions.listsSuccess(response.data))
  } else {
    yield put(ListsActions.listsFailure({ code: response.status, detail: response.data.detail }))
  }
}

export function * requestLists (api) {
  const isWholeDataSet = yield select(state => state.lists.isWholeDataSet)
  // update data if not whole data set
  if (!isWholeDataSet) {
    yield put(ListsActions.listsRequest())
  }
}
