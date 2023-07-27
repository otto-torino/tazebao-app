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
import { reducer as bouncesReducer } from './Bounces'
import { reducer as mailerMessagesReducer } from './MailerMessages'
import { reducer as tourReducer } from './Tour'
import { reducer as subscriptionsStatisticsReducer } from './SubscriptionsStatistics'
import { reducer as subscriptionFormsReducer } from './SubscriptionForms'
import { reducer as systemMessagesReducer } from './SystemMessages'

export default (history) => combineReducers({
  router: connectRouter(history),
  startup: startupReducer,
  auth: authReducer,
  stats: statsReducer,
  systemMessages: systemMessagesReducer,
  subscribers: subscribersReducer,
  subscriptionsStatistics: subscriptionsStatisticsReducer,
  lists: listsReducer,
  topics: topicsReducer,
  campaigns: campaignsReducer,
  planning: planningReducer,
  bounces: bouncesReducer,
  subscriptionForms: subscriptionFormsReducer,
  mailerMessages: mailerMessagesReducer,
  tour: tourReducer
})
