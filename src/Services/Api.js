// a library to wrap and simplify api calls
import history from '../history'
import apisauce from 'apisauce'
import config from '../Config'

// Fixtures
// let mockSuccessfulApiCall = json => new Promise((resolve, reject) => {
//   setTimeout(() => resolve({ ok: true, data:json }), 1500)
// })

const url = (endpoint, querystring) => {
  return endpoint + (Object.keys(querystring).length
    ? '?' + Object.keys(querystring).map(k => `${k}=${querystring[k]}`).join('&')
    : '')
}

// our "constructor"
const create = (baseURL = config.apiBasePath) => {
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    // withCredentials: true,
    timeout: 45000
  })

  // middleware to intercept network errors
  // @TODO find a way, maybe in a pre request middleware to
  // simulate request timeout
  api.addResponseTransform(response => {
    // console.log(response)
    if (
      response.problem === 'NETWORK_ERROR' ||
      response.problem === 'UNKNOWN_ERROR'
    ) {
      console.log('network error, redirecting to ', config.urls.networkError)
      setTimeout(() => history.push(config.urls.networkError), 0)
    }
  })

  // CHANGE AUTH HEADERS AT RUNTIME
  // when login is performed, we need to set the correct auth token for every
  // later request! At the same time we need to remove it on logout
  const setAuthToken = token => api.setHeader('Authorization', 'JWT ' + token)
  const removeAuthToken = () => api.setHeader('Authorization', '')

  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.

  // AUTHENTICATION stuff
  const whoami = () => api.get('/whoami/')
  const login = (username, password) => {
    return api.post('/login/', { username, password })
  }
  const refresh = token => {
    return api.post('/refresh-token/', { token })
  }
  // STATS
  const stats = () => api.get('/newsletter/stats/')
  // SUBSCRIBERS
  const subscribers = (qs = {}) => {
    const endpoint = '/newsletter/subscriber/'
    return api.get(url(endpoint, qs))
  }
  const addSubscriber = subscriber =>
    api.post('/newsletter/subscriber/', subscriber)
  const editSubscriber = subscriber =>
    api.put(`/newsletter/subscriber/${subscriber.id}/`, subscriber)
  const deleteSubscriber = subscriberId =>
    api.delete(`/newsletter/subscriber/${subscriberId}/`)
  const deleteSubscribers = ids =>
    api.post('/newsletter/subscriber/delete_many/', {
      ids: ids
    })
  const deleteSubscribersFromBounces = bouncesIds =>
    api.post('/newsletter/subscriber/delete_from_bounces/', {
      bounces: bouncesIds
    })
  const deleteSubscribersFromMailerMessages = mailerMessagesIds =>
    api.post('/newsletter/subscriber/delete_from_mailermessages/', {
      mailermessages: mailerMessagesIds
    })
  const subscribersAddLists = (subscribers, lists) =>
    api.post('/newsletter/subscriber/add_list/', { subscribers, lists })
  const subscribersRemoveLists = (subscribers, lists) =>
    api.post('/newsletter/subscriber/remove_list/', { subscribers, lists })
  const importSubscribers = data =>
    api.post('/newsletter/subscriber/import/', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
        // 'Content-Disposition': 'inline;filename=import.csv'
      }
    })
  // LISTS
  const lists = (qs = {}) => {
    const endpoint = '/newsletter/subscriberlist/'
    return api.get(url(endpoint, qs))
  }
  const addList = list => api.post('/newsletter/subscriberlist/', list)
  const editList = list =>
    api.put(`/newsletter/subscriberlist/${list.id}/`, list)
  const deleteList = listId =>
    api.delete(`/newsletter/subscriberlist/${listId}/`)
  // TOPICS
  const topics = (qs = {}) => {
    const endpoint = '/newsletter/topic/'
    return api.get(url(endpoint, qs))
  }
  const addTopic = topic => api.post('/newsletter/topic/', topic)
  const editTopic = topic => api.put(`/newsletter/topic/${topic.id}/`, topic)
  const deleteTopic = topicId => api.delete(`/newsletter/topic/${topicId}/`)
  // CAMPAIGNS
  const campaigns = (qs = {}) => {
    const endpoint = '/newsletter/campaign/'
    return api.get(url(endpoint, qs))
  }
  const campaignTemplate = campaignId =>
    api.get(`/newsletter/campaign/${campaignId}/get_template/`)
  const campaignDispatches = campaignId =>
    api.get(`/newsletter/campaign/${campaignId}/dispatches/?page_size=50000`)
  const sendCampaign = (campaignId, lists, test = false) =>
    api.post(`/newsletter/campaign/${campaignId}/send/${test ? '?test=1' : ''}`, { lists })
  const testCampaign = (campaignId, lists) =>
    api.post(`/newsletter/campaign/${campaignId}/test/`, { lists })
  const deleteCampaign = campaignId =>
    api.delete(`/newsletter/campaign/${campaignId}/`)
  const duplicateCampaign = campaignId =>
    api.post(`/newsletter/campaign/${campaignId}/duplicate/`)
  // MOSAICO
  const mosaicoEditor = () => api.get('/mosaico/editor/')
  // PLANNING
  const planning = (qs = {}) => {
    const endpoint = '/newsletter/planning/'
    return api.get(url(endpoint, qs))
  }
  const addPlanning = planning => api.post('/newsletter/planning/', planning)
  const editPlanning = planning =>
    api.put(`/newsletter/planning/${planning.id}/`, planning)
  const deletePlanning = planningId =>
    api.delete(`/newsletter/planning/${planningId}/`)
  // BOUNCES
  const bounces = (qs = {}) => {
    const endpoint = '/newsletter/bounces/'
    return api.get(url(endpoint, qs))
  }
  const deleteBounce = bounceId =>
    api.delete(`/newsletter/bounces/${bounceId}/`)
  // MAILER MESSAGES
  const mailerMessages = (qs = {}) => {
    const endpoint = '/newsletter/mailermessage/'
    return api.get(url(endpoint, qs))
  }
  const deleteMailerMessage = mailerMessageId =>
    api.delete(`/newsletter/mailermessage/${mailerMessageId}/`)
  const unsentMailerMessages = (qs = {}) => {
    const endpoint = '/newsletter/mailermessage/unsent'
    return api.get(url(endpoint, qs))
  }
  // STATISTICS
  const subscriptionsStatistics = () =>
    api.get('/newsletter/subscriptions/stats/')

  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    setAuthToken,
    removeAuthToken,
    whoami,
    login,
    refresh,
    stats,
    subscribers,
    addSubscriber,
    editSubscriber,
    deleteSubscriber,
    deleteSubscribers, // many
    lists,
    subscribersAddLists,
    subscribersRemoveLists,
    importSubscribers,
    addList,
    editList,
    deleteList,
    topics,
    addTopic,
    editTopic,
    deleteTopic,
    campaigns,
    campaignTemplate,
    sendCampaign,
    testCampaign,
    mosaicoEditor,
    planning,
    addPlanning,
    editPlanning,
    deletePlanning,
    deleteCampaign,
    duplicateCampaign,
    campaignDispatches,
    deleteSubscribersFromBounces,
    deleteSubscribersFromMailerMessages,
    bounces,
    deleteBounce,
    mailerMessages,
    deleteMailerMessage,
    unsentMailerMessages,
    subscriptionsStatistics
  }
}

// let's return back our create method as the default.
export default {
  create
}
