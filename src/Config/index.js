export default {
  basePath: '/',
  baseAbsPath: process.env.NODE_ENV === 'test' ? '/' : process.env.REACT_APP_BASE_PATH,
  apiBasePath: process.env.NODE_ENV === 'test' ? 'http://wrong' : process.env.REACT_APP_API_BASE_PATH,
  mosaicoBasePath: process.env.REACT_APP_MOSAICO_BASE_PATH,
  refreshTokenInterval: 6000 * 1,
  breakpoints: { // NB this should coincide with Style/css/_variables.scss breakpoints
    tablet: 768,
    smallDesktop: 992,
    desktop: 1200
  },
  urls: {
    networkError: '/network-error',
    login: '/login',
    home: '/',
    adminSubscribers: '/subscribers',
    adminLists: '/lists',
    adminTopics: '/topics',
    campaigns: '/campaigns',
    planning: '/planning',
    bounces: '/bounces',
    mailerMessages: '/logs',
    createCampaign: '/campaigns/create',
    editCampaign: '/campaigns/edit/:id',
    campaignDetail: '/campaigns/:id',
    sendCampaign: '/campaigns/send/:id',
    integration: '/integration'
  },
  ui: {
    adminListPerPage: 50
  }
}
