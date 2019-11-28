import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { reducer as startupReducer } from './Startup'
import { reducer as authReducer } from './Auth'
import { reducer as statsReducer } from './Stats'
import { reducer as subscribersReducer } from './Subscribers'
import { reducer as listsReducer } from './Lists'
import { reducer as topicsReducer } from './Topics'
import { reducer as campaignsReducer } from './Campaigns'
import { reducer as planningReducer } from './Planning'

export default (history) => combineReducers({
  router: connectRouter(history),
  startup: startupReducer,
  auth: authReducer,
  stats: statsReducer,
  subscribers: subscribersReducer,
  lists: listsReducer,
  topics: topicsReducer,
  campaigns: campaignsReducer,
  planning: planningReducer
})
