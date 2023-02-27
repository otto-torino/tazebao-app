import {
  actionCreator,
  requestBlueprint,
  successBlueprint,
  failureBlueprint,
  requestStateBlueprint
} from './Utils'

// Types
export const SUBSCRIPTIONS_STATISTICS_REQUEST = 'SUBSCRIPTIONS_STATISTICS_REQUEST'
export const SUBSCRIPTIONS_STATISTICS_SUCCESS = 'SUBSCRIPTIONS_STATISTICS_SUCCESS'
export const SUBSCRIPTIONS_STATISTICS_FAILURE = 'SUBSCRIPTIONS_STATISTICS_FAILURE'

// Actions
export default {
  subscriptionsStatisticsRequest: actionCreator(SUBSCRIPTIONS_STATISTICS_REQUEST),
  subscriptionsStatisticsSuccess: actionCreator(SUBSCRIPTIONS_STATISTICS_SUCCESS),
  subscriptionsStatisticsFailure: actionCreator(SUBSCRIPTIONS_STATISTICS_FAILURE)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  data: {}
}

// Reducers

const request = (state) => Object.assign({}, state, { ...requestBlueprint })

// login
export const subscriptionsStatisticsSuccess = (state, data) => {
  return Object.assign({}, state, {
    ...successBlueprint,
    error: false,
    errorCode: null,
    errorMessage: null,
    data
  })
}
const subscriptionsStaticticsFailure = (state, { code, detail }) => {
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
    case SUBSCRIPTIONS_STATISTICS_REQUEST:
      return request(state)
    case SUBSCRIPTIONS_STATISTICS_SUCCESS:
      return subscriptionsStatisticsSuccess(state, payload)
    case SUBSCRIPTIONS_STATISTICS_FAILURE:
      return subscriptionsStaticticsFailure(state, payload)
    default:
      return state
  }
}
