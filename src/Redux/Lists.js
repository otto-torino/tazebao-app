import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const LISTS_QUERYSTRING = 'LISTS_QUERYSTRING'
export const LISTS_REQUEST = 'LISTS_REQUEST'
export const LISTS_SUCCESS = 'LISTS_SUCCESS'
export const LISTS_FAILURE = 'LISTS_FAILURE'

// Actions
export default {
  // login
  listsQuerystring: actionCreator(LISTS_QUERYSTRING),
  listsRequest: actionCreator(LISTS_REQUEST),
  listsSuccess: actionCreator(LISTS_SUCCESS),
  listsFailure: actionCreator(LISTS_FAILURE)
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
export const listsSuccess = (state, data) => {
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
    case LISTS_QUERYSTRING:
      return querystring(state, payload)
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
