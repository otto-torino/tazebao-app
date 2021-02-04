import DashboardSteps from './DashboardSteps'
import SubscribersSteps from './SubscribersSteps'
import ListsSteps from './ListsSteps'
import TopicsSteps from './TopicsSteps'
import CampaignsSteps from './CampaignsSteps'
import PlanningSteps from './PlanningSteps'

export const tourPaths = {
  '/': 'Dashboard',
  '/subscribers': 'Subscribers',
  '/lists': 'Lists',
  '/topics': 'Topics',
  '/campaigns': 'Campaigns',
  '/planning': 'Planning'
}

export default {
  Dashboard: DashboardSteps,
  Subscribers: SubscribersSteps,
  Lists: ListsSteps,
  Topics: TopicsSteps,
  Campaigns: CampaignsSteps,
  Planning: PlanningSteps
}
