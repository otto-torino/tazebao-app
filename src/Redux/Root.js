import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { reducer as startupReducer } from './Startup'
import { reducer as authReducer } from './Auth'

export default (history) => combineReducers({
  router: connectRouter(history),
  startup: startupReducer,
  auth: authReducer
})
