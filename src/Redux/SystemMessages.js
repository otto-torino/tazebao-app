import { actionCreator, requestBlueprint, successBlueprint, failureBlueprint, requestStateBlueprint } from './Utils'

// Types
export const SYSTEM_MESSAGES_REQUEST = 'SYSTEM_MESSAGES_REQUEST'
export const SYSTEM_MESSAGES_SUCCESS = 'SYSTEM_MESSAGES_SUCCESS'
export const SYSTEM_MESSAGES_FAILURE = 'SYSTEM_MESSAGES_FAILURE'

// Actions
export default {
  // login
  systemMessagesRequest: actionCreator(SYSTEM_MESSAGES_REQUEST),
  systemMessagesSuccess: actionCreator(SYSTEM_MESSAGES_SUCCESS),
  systemMessagesFailure: actionCreator(SYSTEM_MESSAGES_FAILURE),
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: [],
}

// Reducers
const request = (state) => Object.assign({}, state, requestBlueprint)

// login
export const systemMessagesSuccess = (state, data) => {
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data,
  })
}
const systemMessagesFailure = (state, { code, detail }) => {
  return Object.assign({}, state, {
    ...failureBlueprint,
    error: true,
    errorCode: code,
    errorMessage: detail,
    data: {},
  })
}

export function reducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SYSTEM_MESSAGES_REQUEST:
      return request(state)
    case SYSTEM_MESSAGES_SUCCESS:
      return systemMessagesSuccess(state, payload)
    case SYSTEM_MESSAGES_FAILURE:
      return systemMessagesFailure(state, payload)
    default:
      return state
  }
}
