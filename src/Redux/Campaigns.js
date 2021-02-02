import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const CAMPAIGNS_QUERYSTRING = 'CAMPAIGNS_QUERYSTRING'
export const CAMPAIGNS_REQUEST = 'CAMPAIGNS_REQUEST'
export const CAMPAIGNS_SUCCESS = 'CAMPAIGNS_SUCCESS'
export const CAMPAIGNS_FAILURE = 'CAMPAIGNS_FAILURE'

// Actions
export default {
  campaignsQuerystring: actionCreator(CAMPAIGNS_QUERYSTRING),
  campaignsRequest: actionCreator(CAMPAIGNS_REQUEST),
  campaignsSuccess: actionCreator(CAMPAIGNS_SUCCESS),
  campaignsFailure: actionCreator(CAMPAIGNS_FAILURE)
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
export const campaignsSuccess = (state, data) => {
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
const campaignsFailure = (state, { code, detail }) => {
  return Object.assign({}, state, {
    ...failureBlueprint,
    error: true,
    errorCode: code,
    errorMessage: detail,
    data: []
  })
}

export function reducer (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case CAMPAIGNS_QUERYSTRING:
      return querystring(state, payload)
    case CAMPAIGNS_REQUEST:
      return request(state)
    case CAMPAIGNS_SUCCESS:
      return campaignsSuccess(state, payload)
    case CAMPAIGNS_FAILURE:
      return campaignsFailure(state, payload)
    default:
      return state
  }
}
