import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const MAILER_MESSAGES_QUERYSTRING = 'MAILER_MESSAGES_QUERYSTRING'
export const MAILER_MESSAGES_REQUEST = 'MAILER_MESSAGES_REQUEST'
export const MAILER_MESSAGES_SUCCESS = 'MAILER_MESSAGES_SUCCESS'
export const MAILER_MESSAGES_FAILURE = 'MAILER_MESSAGES_FAILURE'
export const MAILER_MESSAGES_UNSENT_REQUEST = 'MAILER_MESSAGES_UNSENT_REQUEST'
export const MAILER_MESSAGES_UNSENT_SUCCESS = 'MAILER_MESSAGES_UNSENT_SUCCESS'
export const MAILER_MESSAGES_UNSENT_FAILURE = 'MAILER_MESSAGES_UNSENT_FAILURE'

// Actions
export default {
  // login
  mailerMessagesQuerystring: actionCreator(MAILER_MESSAGES_QUERYSTRING),
  mailerMessagesRequest: actionCreator(MAILER_MESSAGES_REQUEST),
  mailerMessagesSuccess: actionCreator(MAILER_MESSAGES_SUCCESS),
  mailerMessagesFailure: actionCreator(MAILER_MESSAGES_FAILURE),
  mailerMessagesUnsentRequest: actionCreator(MAILER_MESSAGES_UNSENT_REQUEST),
  mailerMessagesUnsentSuccess: actionCreator(MAILER_MESSAGES_UNSENT_SUCCESS),
  mailerMessagesUnsentFailure: actionCreator(MAILER_MESSAGES_UNSENT_FAILURE)
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
  },
  unsent: 0
}

// Reducers
const querystring = (state, qs) => Object.assign({}, state, { qs })
const request = state => Object.assign({}, state, requestBlueprint)

export const mailerMessagesSuccess = (state, data) => {
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
const mailerMessagesFailure = (state, { code, detail }) => {
  return Object.assign({}, state, {
    ...failureBlueprint,
    error: true,
    errorCode: code,
    errorMessage: detail,
    data: {}
  })
}

const mailerMessagesUnsentSuccess = (state, data) => ({ ...state, unsent: data.unsent })
const mailerMessagesUnsentFailure = (state, data) => ({ ...state, unsent: 0 })

export function reducer (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case MAILER_MESSAGES_QUERYSTRING:
      return querystring(state, payload)
    case MAILER_MESSAGES_REQUEST:
      return request(state)
    case MAILER_MESSAGES_SUCCESS:
      return mailerMessagesSuccess(state, payload)
    case MAILER_MESSAGES_FAILURE:
      return mailerMessagesFailure(state, payload)
    case MAILER_MESSAGES_UNSENT_REQUEST:
      return request(state)
    case MAILER_MESSAGES_UNSENT_SUCCESS:
      return mailerMessagesUnsentSuccess(state, payload)
    case MAILER_MESSAGES_UNSENT_FAILURE:
      return mailerMessagesUnsentFailure(state, payload)
    default:
      return state
  }
}
