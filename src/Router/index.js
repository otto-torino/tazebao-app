import React from 'react'
import PropTypes from 'prop-types'
import store from '../Redux/Store'
import { ConnectedRouter } from 'connected-react-router'
import history from '../history'
import config from '../Config'
import { Route, Redirect, Switch } from 'react-router-dom'
// actions
import StatsActions from '../Redux/Stats'
import CampaignsActions from '../Redux/Campaigns'
import PlanningActions from '../Redux/Planning'
import BouncesActions from '../Redux/Bounces'
import MailerMessagesActions from '../Redux/MailerMessages'
import SubscriptionsStatisticsActions from '../Redux/SubscriptionsStatistics'
import SubscriptionFormsActions from '../Redux/SubscriptionForms'
// views
import LoginView from '../Views/LoginView'
import HomeView from '../Views/HomeView'
import AdminSubscribersView from '../Views/AdminSubscribersView'
import AdminListsView from '../Views/AdminListsView'
import AdminTopicsView from '../Views/AdminTopicsView'
import CampaignsView from '../Views/CampaignsView'
import EditCampaignView from '../Views/EditCampaignView'
import SendCampaignView from '../Views/SendCampaignView'
import CampaignDetailView from '../Views/CampaignDetailView'
import PlanningView from '../Views/PlanningView'
import BouncesView from '../Views/BouncesView'
import MailerMessagesView from '../Views/MailerMessagesView'
import IntegrationView from '../Views/IntegrationView'
import SubscriptionFormsView from '../Views/SubscriptionFormsView'
import StatisticsView from '../Views/StatisticsView'
import CampaignsStatisticsView from '../Views/CampaignsStatisticsView'
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
            path={config.urls.campaignsStatistics}
            component={CampaignsStatisticsView}
          />
          <PrivateRoute
            exact
            path={config.urls.adminSubscribers}
            component={AdminSubscribersView}
          />
          <PrivateRoute
            exact
            path={config.urls.adminLists}
            component={AdminListsView}
          />
          <PrivateRoute
            exact
            path={config.urls.adminTopics}
            component={AdminTopicsView}
          />
          <PrivateRoute
            exact
            path={config.urls.createCampaign}
            component={EditCampaignView}
          />
          <PrivateRoute
            exact
            path={config.urls.editCampaign}
            component={EditCampaignView}
            actions={[
              [CampaignsActions.campaignsRequest(), (state) => true]
            ]}
          />
          <PrivateRoute
            exact
            path={config.urls.sendCampaign}
            component={SendCampaignView}
            actions={[
              [CampaignsActions.campaignsRequest(), (state) => true],
              [MailerMessagesActions.mailerMessagesUnsentRequest(), (state) => true]
            ]}
          />
          <PrivateRoute
            exact
            path={config.urls.campaignDetail}
            component={CampaignDetailView}
            actions={[
              [CampaignsActions.campaignsRequest(), (state) => true]
            ]}
          />
          <PrivateRoute
            exact
            path={config.urls.campaigns}
            component={CampaignsView}
          />
          <PrivateRoute
            exact
            path={config.urls.planning}
            component={PlanningView}
            actions={[
              [PlanningActions.planningRequest(), (state) => true],
              [CampaignsActions.campaignsRequest(), (state) => true]
            ]}
          />
          <PrivateRoute
            exact
            path={config.urls.bounces}
            component={BouncesView}
            actions={[
              [BouncesActions.bouncesRequest(), (state) => true]
            ]}
          />
          <PrivateRoute
            exact
            path={config.urls.mailerMessages}
            component={MailerMessagesView}
            actions={[
              [MailerMessagesActions.mailerMessagesRequest(), (state) => true]
            ]}
          />
          <PrivateRoute
            exact
            path={config.urls.statistics}
            component={StatisticsView}
            actions={[
              [SubscriptionsStatisticsActions.subscriptionsStatisticsRequest(), (state) => true]
            ]}
          />
          <PrivateRoute
            exact
            path={config.urls.subscriptionForms}
            component={SubscriptionFormsView}
            actions={[
              [SubscriptionFormsActions.subscriptionFormsRequest(), (state) => true]
            ]}
          />
          <PrivateRoute
            exact
            path={config.urls.integration}
            component={IntegrationView}
          />
          <PrivateRoute
            exact
            path={config.urls.home}
            component={HomeView}
            actions={[
              [StatsActions.statsRequest(), (state) => true]
            ]}
          />
        </Switch>
      </ConnectedRouter>
    )
  }
}

export default AppRouter
