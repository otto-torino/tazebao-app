import { call, put, select } from 'redux-saga/effects'
import CampaignsActions from '../Redux/Campaigns'

export function * fetchCampaigns (api, { payload }) {
  // request
  const response = yield call(api.campaigns)
  console.log('CAZZO', response)
  // success?
  if (response.ok) {
    yield put(CampaignsActions.campaignsSuccess(response.data))
  } else {
    yield put(CampaignsActions.campaignsFailure({ code: response.status, detail: response.data ? response.data.detail : response.problem }))
  }
}
