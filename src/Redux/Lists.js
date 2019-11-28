import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const LISTS_REQUEST = 'LISTS_REQUEST'
export const LISTS_SUCCESS = 'LISTS_SUCCESS'
export const LISTS_FAILURE = 'LISTS_FAILURE'

// Actions
export default {
  // login
  listsRequest: actionCreator(LISTS_REQUEST),
  listsSuccess: actionCreator(LISTS_SUCCESS),
  listsFailure: actionCreator(LISTS_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: {}
}

// Reducers
const request = state => Object.assign({}, state, requestBlueprint)

// login
export const listsSuccess = (state, data) => {
  const dataDict = {}
  data.forEach(l => { dataDict[l.id] = l })
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data: dataDict
  })
}
const listsFailure = (state, { code, detail }) => {
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
    case LISTS_REQUEST:
      return request(state)
    case LISTS_SUCCESS:
      return listsSuccess(state, payload)
    case LISTS_FAILURE:
      return listsFailure(state, payload)
    default:
      return state
  }
}
