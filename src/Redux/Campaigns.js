import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const CAMPAIGNS_REQUEST = 'CAMPAIGNS_REQUEST'
export const CAMPAIGNS_SUCCESS = 'CAMPAIGNS_SUCCESS'
export const CAMPAIGNS_FAILURE = 'CAMPAIGNS_FAILURE'

// Actions
export default {
  // login
  campaignsRequest: actionCreator(CAMPAIGNS_REQUEST),
  campaignsSuccess: actionCreator(CAMPAIGNS_SUCCESS),
  campaignsFailure: actionCreator(CAMPAIGNS_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: []
}

// Reducers
const request = state => Object.assign({}, state, requestBlueprint)

// login
export const campaignsSuccess = (state, data) => {
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data: data.results
  })
}
const campaignsFailure = (state, { code, detail }) => {
  return Object.assign({}, state, {
    ...failureBlueprint,
    error: true,
    errorCode: code,
    errorMessage: detail,
    data: []
  })
}

export function reducer (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case CAMPAIGNS_REQUEST:
      return request(state)
    case CAMPAIGNS_SUCCESS:
      return campaignsSuccess(state, payload)
    case CAMPAIGNS_FAILURE:
      return campaignsFailure(state, payload)
    default:
      return state
  }
}
