import React from 'react'
import PropTypes from 'prop-types'
import store from '../Redux/Store'
import { ConnectedRouter } from 'connected-react-router'
import history from '../history'
import config from '../Config'
import { Route, Redirect, Switch } from 'react-router-dom'
// views
import LoginView from '../Views/LoginView'
import HomeView from '../Views/HomeView'
import NetworkErrorView from '../Views/NetworkErrorView'

/**
 * A decorator for private routes which redirects to login
 * if user is not authenticated
 * @param Component: the component to render
 * @param permFunction: a function to check user permissions for the view, receives the user object, must return a bool
 * @param actions: actions to be dispatched, in the form [action, shouldDispatch]
 *                 action is the action to dispatch
 *                 shouldDispatch is a function that receives the application state and returns true
 *                 if the action should be dispatched, false otherwise
 */
export const PrivateRoute = ({ component: Component, componentProps = {}, permFunction, actions, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const state = store.getState()
      if (state.auth.isAuthenticated &&
        (!permFunction || permFunction(state.auth.user))) {
        // actions that needs to be dispatched before entering the view
        if (actions && actions.length) {
          actions.forEach(([action, shouldDispatch]) => {
            if (shouldDispatch(state)) {
              store.dispatch(action)
            }
          })
        }
        return <Component {...props} {...componentProps} />
      } else {
        return (
          <Redirect
            to={{
              pathname: config.urls.login,
              state: { from: props.location }
            }}
          />
        )
      }
    }}
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  componentProps: PropTypes.object,
  location: PropTypes.object,
  permFunction: PropTypes.func,
  actions: PropTypes.array
}

/**
 * This component defines all the application routes, public and private ones.
 * @TODO implement the right shouldDispatch functions
 */
class AppRouter extends React.Component {
  render () {
    return (
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path={config.urls.networkError} component={NetworkErrorView} />
          <Route exact path={config.urls.login} component={LoginView} />
          <PrivateRoute
            exact
            path={config.urls.home}
            component={HomeView}
          />
        </Switch>
      </ConnectedRouter>
    )
  }
}

export default AppRouter
