import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const TOPICS_QUERYSTRING = 'TOPICS_QUERYSTRING'
export const TOPICS_REQUEST = 'TOPICS_REQUEST'
export const TOPICS_SUCCESS = 'TOPICS_SUCCESS'
export const TOPICS_FAILURE = 'TOPICS_FAILURE'

// Actions
export default {
  // login
  topicsQuerystring: actionCreator(TOPICS_QUERYSTRING),
  topicsRequest: actionCreator(TOPICS_REQUEST),
  topicsSuccess: actionCreator(TOPICS_SUCCESS),
  topicsFailure: actionCreator(TOPICS_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: {},
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
export const topicsSuccess = (state, data) => {
  // if not paginated, data.count is undefined, because data only contains the list of items
  const { count, next, previous, results } = data.count !== undefined
    ? data // no pagination
    : { count: data.length, next: null, previous: null, results: data } // pagination
  // calculate the page size if it is not the whole set (do this just for the first request or increased page size)
  const qs = { ...state.qs }
  if (data.count !== undefined && (!state.fetched || state.qs.page_size < results.length)) {
    qs.page_size = results.length
  }

  const dataDict = {}
  results.forEach(l => { dataDict[l.id] = l })
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data: dataDict,
    isWholeDataSet: data.count === undefined,
    count,
    next,
    previous,
    qs
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
    case TOPICS_QUERYSTRING:
      return querystring(state, payload)
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
