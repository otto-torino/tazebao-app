import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const BOUNCES_QUERYSTRING = 'BOUNCES_QUERYSTRING'
export const BOUNCES_REQUEST = 'BOUNCES_REQUEST'
export const BOUNCES_SUCCESS = 'BOUNCES_SUCCESS'
export const BOUNCES_FAILURE = 'BOUNCES_FAILURE'

// Actions
export default {
  // login
  bouncesQuerystring: actionCreator(BOUNCES_QUERYSTRING),
  bouncesRequest: actionCreator(BOUNCES_REQUEST),
  bouncesSuccess: actionCreator(BOUNCES_SUCCESS),
  bouncesFailure: actionCreator(BOUNCES_FAILURE)
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
const request = state => Object.assign({}, state, requestBlueprint)

// login
export const bouncesSuccess = (state, data) => {
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
    data: data,
    isWholeDataSet: data.count === undefined,
    count,
    next,
    previous,
    qs
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
    case BOUNCES_QUERYSTRING:
      return querystring(state, payload)
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
