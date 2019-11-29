export default {
  basePath: '/',
  baseAbsPath: process.env.NODE_ENV === 'test' ? '/' : process.env.REACT_APP_BASE_PATH,
  apiBasePath: process.env.NODE_ENV === 'test' ? 'http://wrong' : process.env.REACT_APP_API_BASE_PATH,
  mosaicoBasePath: process.env.REACT_APP_MOSAICO_BASE_PATH,
  // apiBasePath: process.env.NODE_ENV === 'test' ? 'http://wrong' : 'https://tazebao.sqrt64.it/api/v1',
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
    campaigns: '/campigns',
    planning: '/planning',
    bounces: '/bounces',
    createCampaign: '/campigns/create',
    editCampaign: '/campigns/edit/:id',
    campaignDetail: '/campigns/:id',
    sendCampaign: '/campigns/send/:id'
  },
  ui: {
    adminListPerPage: 50
  }
}
