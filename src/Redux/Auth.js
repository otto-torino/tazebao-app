import { actionCreator, requestBlueprint, successBlueprint, failureBlueprint, requestStateBlueprint } from './Utils'
import JWT from '../Services/JWT'

// Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const LOGOUT = 'LOGOUT'

export const REFRESH_REQUEST = 'REFRESH_REQUEST'
export const REFRESH_SUCCESS = 'REFRESH_SUCCESS'
export const REFRESH_FAILURE = 'REFRESH_FAILURE'

export const WHOAMI_REQUEST = 'WHOAMI_REQUEST'
export const WHOAMI_SUCCESS = 'WHOAMI_SUCCESS'
export const WHOAMI_FAILURE = 'WHOAMI_FAILURE'

export const AUTH_RESET = 'AUTH_RESET'

// Actions
export default {
  // login
  loginRequest: actionCreator(LOGIN_REQUEST),
  loginSuccess: actionCreator(LOGIN_SUCCESS),
  loginFailure: actionCreator(LOGIN_FAILURE),
  // logout
  logout: actionCreator(LOGOUT),
  // refresh token
  refreshRequest: actionCreator(REFRESH_REQUEST),
  refreshSuccess: actionCreator(REFRESH_SUCCESS),
  refreshFailure: actionCreator(REFRESH_FAILURE),
  // whoami
  whoamiRequest: actionCreator(WHOAMI_REQUEST),
  whoamiSuccess: actionCreator(WHOAMI_SUCCESS),
  whoamiFailure: actionCreator(WHOAMI_FAILURE),
  reset: actionCreator(AUTH_RESET)
}

// Initial state
export const INITIAL_STATE = {
  ...requestStateBlueprint,
  isAuthenticated: false,
  token: JWT.get(),
  refreshToken: JWT.getRefresh(),
  user: {}
}

// Reducers
const request = state => Object.assign({}, state, requestBlueprint)

// login
export const loginSuccess = (state, { token, refreshToken }) => {
  JWT.save(token)
  JWT.saveRefresh(refreshToken)
  return Object.assign({}, state, {
    ...successBlueprint,
    token,
    refreshToken,
    error: false,
    errorCode: null,
    errorMessage: null,
    isAuthenticated: true
  })
}
const loginFailure = (state, { code, message }) => {
  JWT.delete()
  JWT.deleteRefresh()
  return Object.assign({}, state, {
    ...failureBlueprint,
    isAuthenticated: false,
    error: true,
    errorCode: code,
    errorMessage: message,
    token: null,
    refreshToken: null,
    user: {}
  })
}

export const logout = state => {
  JWT.delete()
  JWT.deleteRefresh()
  return INITIAL_STATE
}

// refresh
export const refreshSuccess = (state, { token, refreshToken }) => {
  JWT.save(token)
  JWT.saveRefresh(refreshToken)
  return Object.assign({}, state, {
    ...successBlueprint,
    isAuthenticated: true,
    token,
    refreshToken
  })
}
const refreshFailure = (state, { code, message }) => Object.assign({}, state, {
  ...failureBlueprint,
  isAuthenticated: false,
  errorCode: code,
  errorMessage: message,
  user: {}
})

// whaoami
export const whoamiSuccess = (state, user) => Object.assign({}, state, {
  ...successBlueprint,
  user,
  isAuthenticated: !!(user && user.email)
})
const whoamiFailure = (state, { code, message }) => {
  JWT.delete()
  JWT.deleteRefresh()
  return Object.assign({}, state, {
    ...failureBlueprint,
    user: {},
    isAuthenticated: false,
    errorCode: code,
    errorMessage: message
  })
}

// reset
const reset = state => INITIAL_STATE

export function reducer (state=INITIAL_STATE, { type, payload }) {
  switch(type) {
    case LOGIN_REQUEST:
      return request(state)
    case LOGIN_SUCCESS:
      return loginSuccess(state, payload)
    case LOGIN_FAILURE:
      return loginFailure(state, payload)
    case LOGOUT:
      return logout(state)
    case REFRESH_REQUEST:
      return request(state)
    case REFRESH_SUCCESS:
      return refreshSuccess(state, payload)
    case REFRESH_FAILURE:
      return refreshFailure(state, payload)
    case WHOAMI_REQUEST:
      return request(state)
    case WHOAMI_SUCCESS:
      return whoamiSuccess(state, payload)
    case WHOAMI_FAILURE:
      return whoamiFailure(state, payload)
    case AUTH_RESET:
      return reset(state)
    default:
      return state
  }
}
