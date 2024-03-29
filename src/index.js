import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './Redux/Store'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import './i18n'
import App from './App'
import * as serviceWorker from './serviceWorker'
import moment from 'moment'
import 'moment/locale/it'

moment.locale('it')

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
