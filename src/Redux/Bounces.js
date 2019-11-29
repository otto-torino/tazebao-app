import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const BOUNCES_REQUEST = 'BOUNCES_REQUEST'
export const BOUNCES_SUCCESS = 'BOUNCES_SUCCESS'
export const BOUNCES_FAILURE = 'BOUNCES_FAILURE'

// Actions
export default {
  // login
  bouncesRequest: actionCreator(BOUNCES_REQUEST),
  bouncesSuccess: actionCreator(BOUNCES_SUCCESS),
  bouncesFailure: actionCreator(BOUNCES_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: []
}

// Reducers
const request = state => Object.assign({}, state, requestBlueprint)

// login
export const bouncesSuccess = (state, data) => {
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data: data
  })
}
const bouncesFailure = (state, { code, detail }) => {
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
    case BOUNCES_REQUEST:
      return request(state)
    case BOUNCES_SUCCESS:
      return bouncesSuccess(state, payload)
    case BOUNCES_FAILURE:
      return bouncesFailure(state, payload)
    default:
      return state
  }
}
