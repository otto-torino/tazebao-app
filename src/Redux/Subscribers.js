import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const SUBSCRIBERS_REQUEST = 'SUBSCRIBERS_REQUEST'
export const SUBSCRIBERS_SUCCESS = 'SUBSCRIBERS_SUCCESS'
export const SUBSCRIBERS_FAILURE = 'SUBSCRIBERS_FAILURE'

// Actions
export default {
  // login
  subscribersRequest: actionCreator(SUBSCRIBERS_REQUEST),
  subscribersSuccess: actionCreator(SUBSCRIBERS_SUCCESS),
  subscribersFailure: actionCreator(SUBSCRIBERS_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: [],
  count: 0,
  next: '',
  previous: ''
}

// Reducers
const request = (state, payload = {}) => Object.assign({}, state, {
  ...requestBlueprint,
  reset: Object.keys(payload).length === 0
})

// login
export const subscribersSuccess = (state, data) => {
  const { count, next, previous, results } = data.count !== undefined
    ? data // no pagination
    : { count: data.length, next: null, previous: null, results: data } // pagination
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data: results,
    isWholeDataSet: data.count === undefined,
    count,
    next,
    previous
  })
}
const subscribersFailure = (state, { code, detail }) => {
  return Object.assign({}, state, {
    ...failureBlueprint,
    error: true,
    errorCode: code,
    errorMessage: detail,
    data: [],
    count: 0,
    next: ''
  })
}

export function reducer (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case SUBSCRIBERS_REQUEST:
      return request(state, payload)
    case SUBSCRIBERS_SUCCESS:
      return subscribersSuccess(state, payload)
    case SUBSCRIBERS_FAILURE:
      return subscribersFailure(state, payload)
    default:
      return state
  }
}
