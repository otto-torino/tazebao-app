export default {
  basePath: '/',
  baseAbsPath: process.env.NODE_ENV === 'test' ? '/' : process.env.REACT_APP_BASE_PATH,
  apiBasePath: process.env.NODE_ENV === 'test' ? 'http://wrong' : process.env.REACT_APP_API_BASE_PATH,
  breakpoints: { // NB this should coincide with Style/css/_variables.scss breakpoints
    tablet: 768,
    smallDesktop: 992,
    desktop: 1200
  },
  urls: {
    networkError: '/network-error',
    login: '/login',
    home: '/'
  }
}
