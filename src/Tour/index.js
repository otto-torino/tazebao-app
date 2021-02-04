import DashboardSteps from './DashboardSteps'
import SubscribersSteps from './SubscribersSteps'
import ListsSteps from './ListsSteps'

export const tourPaths = {
  '/': 'Dashboard',
  '/subscribers': 'Subscribers',
  '/lists': 'Lists'
}

export default {
  Dashboard: DashboardSteps,
  Subscribers: SubscribersSteps,
  Lists: ListsSteps
}
