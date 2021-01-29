/**
 * What the hell are sagas?
 *
 * TL;DR:
 * Every time you need to trigger some actions as a consequence of another action
 * you can use Sagas to declare such dependencies.
 *
 * It's simpler than you may think.
 * redux-saga uses js ES6 iterators in order to pause and resume
 * tied operations.
 * Why shall we care about tied operations?
 * Side effects baby.
 * The simpler situation to think about is an htt request.
 * es, because it involves an OnRequest event, follwed by an onSuccess
 * or onError event.
 * This events must be treated as redux actions, since everything which
 * changes the store is in fact a redux action.
 * So we have an onRequest action that should immediately fire an
 * onSuccess action => collateral effect
 * redux-saga injects itself as a middleware in redux, inspecting dispatched
 * actions, and can immediately fire other actions if tied to the received one.
 * So in our example, you need only to manually dispatch the request action,
 * and saga will take care of dispatching the subsequent action after the request is complete.
 */
import { takeLatest, all } from 'redux-saga/effects'
// the majority of sagas regards api calls

/* ------------- Types ------------- */
import { STARTUP } from '../Redux/Startup'
import { LOGIN_REQUEST, LOGOUT, WHOAMI_REQUEST, REFRESH_REQUEST } from '../Redux/Auth'
import { STATS_REQUEST } from '../Redux/Stats'
import { SUBSCRIBERS_REQUEST } from '../Redux/Subscribers'
import { LISTS_REQUEST } from '../Redux/Lists'
import { TOPICS_REQUEST } from '../Redux/Topics'
import { CAMPAIGNS_REQUEST } from '../Redux/Campaigns'
import { PLANNING_REQUEST } from '../Redux/Planning'
import { BOUNCES_REQUEST } from '../Redux/Bounces'

/* ------------- Sagas ------------- */
import { startup } from './StartupSagas'
import { login, whoami, refresh, logout } from './AuthSagas'
import { fetchSubscribers } from './SubscribersSagas'
import { fetchLists } from './ListsSagas'
import { fetchTopics } from './TopicsSagas'
import { fetchCampaigns } from './CampaignsSagas'
import { fetchPlanning } from './PlanningSagas'
import { fetchBounces } from './BouncesSagas'
import { fetchStats } from './StatsSagas'

/* ------------- API ------------- */
import API from '../Services/Api'
const api = API.create()

export default function * root (dispatch) {
  yield all([
    takeLatest(STARTUP, startup, api),
    takeLatest(LOGIN_REQUEST, login, api),
    takeLatest(LOGOUT, logout),
    takeLatest(REFRESH_REQUEST, refresh, api),
    takeLatest(WHOAMI_REQUEST, whoami, { api, dispatch }),
    takeLatest(STATS_REQUEST, fetchStats, api),
    takeLatest(SUBSCRIBERS_REQUEST, fetchSubscribers, api),
    takeLatest(LISTS_REQUEST, fetchLists, api),
    takeLatest(TOPICS_REQUEST, fetchTopics, api),
    takeLatest(CAMPAIGNS_REQUEST, fetchCampaigns, api),
    takeLatest(PLANNING_REQUEST, fetchPlanning, api),
    takeLatest(BOUNCES_REQUEST, fetchBounces, api)
  ])
}

// export this api instance in order to be used elsewhere. This is the unique api instance which
// has the authorization token set
export { api }
