const JWT = {
  save: function (token) {
    window.localStorage.setItem('token', token)
  },
  get: function () {
    return window.localStorage.getItem('token')
  },
  delete: function () {
    window.localStorage.removeItem('token')
  },
  saveRefresh: function (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken)
  },
  getRefresh: function () {
    return window.localStorage.getItem('refreshToken')
  },
  deleteRefresh: function () {
    window.localStorage.removeItem('refreshToken')
  }
}

export default JWT
