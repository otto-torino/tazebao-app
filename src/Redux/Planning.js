import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const PLANNING_REQUEST = 'PLANNING_REQUEST'
export const PLANNING_SUCCESS = 'PLANNING_SUCCESS'
export const PLANNING_FAILURE = 'PLANNING_FAILURE'

// Actions
export default {
  // login
  planningRequest: actionCreator(PLANNING_REQUEST),
  planningSuccess: actionCreator(PLANNING_SUCCESS),
  planningFailure: actionCreator(PLANNING_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: []
}

// Reducers
const request = state => Object.assign({}, state, requestBlueprint)

// login
export const planningSuccess = (state, data) => {
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data: data
  })
}
const planningFailure = (state, { code, detail }) => {
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
    case PLANNING_REQUEST:
      return request(state)
    case PLANNING_SUCCESS:
      return planningSuccess(state, payload)
    case PLANNING_FAILURE:
      return planningFailure(state, payload)
    default:
      return state
  }
}
