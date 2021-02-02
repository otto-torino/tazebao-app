import { call, put, select } from 'redux-saga/effects'
import CampaignsActions from '../Redux/Campaigns'

export function * fetchCampaigns (api, { payload }) {
  const alreadyFetched = yield select(state => state.campaigns.fetched)
  const isWholeDataSet = yield select(state => state.campaigns.isWholeDataSet)

  // if not first request and not whole match set and no payload is given, use the redux stored payload
  if (payload === undefined && alreadyFetched && !isWholeDataSet) {
    payload = yield select(state => state.campaigns.qs)
  }

  const { filters, ...rest } = payload || {}

  // request
  const response = yield call(api.campaigns, { ...rest, ...filters })

  // success?
  if (response.ok) {
    yield put(CampaignsActions.campaignsSuccess(response.data))
  } else {
    yield put(CampaignsActions.campaignsFailure({
      code: response.status,
      detail: response.data ? response.data.detail : response.problem
    }))
  }
}

export function * requestCampaigns (api) {
  const isWholeDataSet = yield select(state => state.campaigns.isWholeDataSet)
  // update data if not whole data set
  if (!isWholeDataSet) {
    yield put(CampaignsActions.campaignsRequest())
  }
}
