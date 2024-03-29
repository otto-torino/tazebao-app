import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const SUBSCRIBERS_QUERYSTRING = 'SUBSCRIBERS_QUERYSTRING'
export const SUBSCRIBERS_REQUEST = 'SUBSCRIBERS_REQUEST'
export const SUBSCRIBERS_SUCCESS = 'SUBSCRIBERS_SUCCESS'
export const SUBSCRIBERS_FAILURE = 'SUBSCRIBERS_FAILURE'

// Actions
export default {
  subscribersQuerystring: actionCreator(SUBSCRIBERS_QUERYSTRING),
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
  previous: '',
  qs: {
    page: 1,
    page_size: 10,
    sort: 'id',
    sort_direction: 'desc'
  }
}

// Reducers

const querystring = (state, qs) => Object.assign({}, state, { qs })

const request = (state) => Object.assign({}, state, { ...requestBlueprint })

// login
export const subscribersSuccess = (state, data, init = false) => {
  // if not paginated, data.count is undefined, because data only contains the list of items
  const { count, next, previous, results } = data.count !== undefined
    ? data // no pagination
    : { count: data.length, next: null, previous: null, results: data } // pagination
  // calculate the page size if it is not the whole set (do this just for the first request or increased page size)
  const qs = { ...state.qs }
  if (data.count !== undefined && (!state.fetched || state.qs.page_size < results.length)) {
    qs.page_size = results.length
  }
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data: results,
    isWholeDataSet: data.count === undefined,
    count,
    next,
    previous,
    qs
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
    case SUBSCRIBERS_QUERYSTRING:
      return querystring(state, payload)
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
