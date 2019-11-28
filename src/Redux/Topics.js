import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const TOPICS_REQUEST = 'TOPICS_REQUEST'
export const TOPICS_SUCCESS = 'TOPICS_SUCCESS'
export const TOPICS_FAILURE = 'TOPICS_FAILURE'

// Actions
export default {
  // login
  topicsRequest: actionCreator(TOPICS_REQUEST),
  topicsSuccess: actionCreator(TOPICS_SUCCESS),
  topicsFailure: actionCreator(TOPICS_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: {}
}

// Reducers
const request = state => Object.assign({}, state, requestBlueprint)

// login
export const topicsSuccess = (state, data) => {
  let dataDict = {}
  data.forEach(l => dataDict[l.id] = l)
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data: dataDict
  })
}
const topicsFailure = (state, { code, detail }) => {
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
    case TOPICS_REQUEST:
      return request(state)
    case TOPICS_SUCCESS:
      return topicsSuccess(state, payload)
    case TOPICS_FAILURE:
      return topicsFailure(state, payload)
    default:
      return state
  }
}
