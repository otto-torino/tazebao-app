import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const SUBSCRIPTION_FORMS_QUERYSTRING = 'SUBSCRIPTION_FORMS_QUERYSTRING'
export const SUBSCRIPTION_FORMS_REQUEST = 'SUBSCRIPTION_FORMS_REQUEST'
export const SUBSCRIPTION_FORMS_SUCCESS = 'SUBSCRIPTION_FORMS_SUCCESS'
export const SUBSCRIPTION_FORMS_FAILURE = 'SUBSCRIPTION_FORMS_FAILURE'

// Actions
export default {
  subscriptionFormsQuerystring: actionCreator(SUBSCRIPTION_FORMS_QUERYSTRING),
  subscriptionFormsRequest: actionCreator(SUBSCRIPTION_FORMS_REQUEST),
  subscriptionFormsSuccess: actionCreator(SUBSCRIPTION_FORMS_SUCCESS),
  subscriptionFormsFailure: actionCreator(SUBSCRIPTION_FORMS_FAILURE)
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
export const subscriptionFormsSuccess = (state, data) => {
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
const subscriptionFormsFailure = (state, { code, detail }) => {
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
    case SUBSCRIPTION_FORMS_QUERYSTRING:
      return querystring(state, payload)
    case SUBSCRIPTION_FORMS_REQUEST:
      return request(state)
    case SUBSCRIPTION_FORMS_SUCCESS:
      return subscriptionFormsSuccess(state, payload)
    case SUBSCRIPTION_FORMS_FAILURE:
      return subscriptionFormsFailure(state, payload)
    default:
      return state
  }
}
