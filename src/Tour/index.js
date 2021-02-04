import DashboardSteps from './DashboardSteps'
import SubscribersSteps from './SubscribersSteps'
import ListsSteps from './ListsSteps'
import TopicsSteps from './TopicsSteps'

export const tourPaths = {
  '/': 'Dashboard',
  '/subscribers': 'Subscribers',
  '/lists': 'Lists',
  '/topics': 'Topics'
}

export default {
  Dashboard: DashboardSteps,
  Subscribers: SubscribersSteps,
  Lists: ListsSteps,
  Topics: TopicsSteps
}
