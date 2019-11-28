import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const STATS_REQUEST = 'STATS_REQUEST'
export const STATS_SUCCESS = 'STATS_SUCCESS'
export const STATS_FAILURE = 'STATS_FAILURE'

// Actions
export default {
  // login
  statsRequest: actionCreator(STATS_REQUEST),
  statsSuccess: actionCreator(STATS_SUCCESS),
  statsFailure: actionCreator(STATS_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: {}
}

// Reducers
const request = state => Object.assign({}, state, requestBlueprint)

// login
export const statsSuccess = (state, data) => {
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data
  })
}
const statsFailure = (state, { code, detail }) => {
  return Object.assign({}, state, {
    ...failureBlueprint,
    error: true,
    errorCode: code,
    errorMessage: detail,
    data: {}
  })
}

export function reducer (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case STATS_REQUEST:
      return request(state)
    case STATS_SUCCESS:
      return statsSuccess(state, payload)
    case STATS_FAILURE:
      return statsFailure(state, payload)
    default:
      return state
  }
}
