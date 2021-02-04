import DashboardSteps from './DashboardSteps'
import SubscribersSteps from './SubscribersStep'

export const tourPaths = {
  '/': 'Dashboard',
  '/subscribers': 'Subscribers'
}

export default {
  Dashboard: DashboardSteps,
  Subscribers: SubscribersSteps
}
