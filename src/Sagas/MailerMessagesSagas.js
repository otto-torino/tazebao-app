import { call, put, select } from 'redux-saga/effects'
import MailerMessagesActions from '../Redux/MailerMessages'

export function * fetchMailerMessages (api, { payload }) {
  const alreadyFetched = yield select(state => state.mailerMessages.fetched)
  const isWholeDataSet = yield select(state => state.mailerMessages.isWholeDataSet)

  // if not first request and not whole match set and no payload is given, use the redux stored payload
  if (payload === undefined && alreadyFetched && !isWholeDataSet) {
    payload = yield select(state => state.mailerMessages.qs)
  }

  const { filters, ...rest } = payload || {}

  // request
  const response = yield call(api.mailerMessages, { ...rest, ...filters })

  // success?
  if (response.ok) {
    yield put(MailerMessagesActions.mailerMessagesSuccess(response.data))
  } else {
    yield put(MailerMessagesActions.mailerMessagesFailure({ code: response.status, detail: response.data.detail }))
  }
}

export function * requestMailerMessages (api) {
  const isWholeDataSet = yield select(state => state.mailerMessages.isWholeDataSet)
  // update data if not whole data set
  if (!isWholeDataSet) {
    yield put(MailerMessagesActions.mailerMessagesRequest())
  }
}
