import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const PLANNING_QUERYSTRING = 'PLANNING_QUERYSTRING'
export const PLANNING_REQUEST = 'PLANNING_REQUEST'
export const PLANNING_SUCCESS = 'PLANNING_SUCCESS'
export const PLANNING_FAILURE = 'PLANNING_FAILURE'

// Actions
export default {
  planningQuerystring: actionCreator(PLANNING_QUERYSTRING),
  planningRequest: actionCreator(PLANNING_REQUEST),
  planningSuccess: actionCreator(PLANNING_SUCCESS),
  planningFailure: actionCreator(PLANNING_FAILURE)
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

export const planningSuccess = (state, data) => {
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
    case PLANNING_QUERYSTRING:
      return querystring(state, payload)
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
