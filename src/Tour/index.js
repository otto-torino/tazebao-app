import DashboardSteps from './DashboardSteps'
import SubscribersSteps from './SubscribersSteps'
import ListsSteps from './ListsSteps'
import TopicsSteps from './TopicsSteps'
import CampaignsSteps from './CampaignsSteps'
import PlanningSteps from './PlanningSteps'
import BouncesSteps from './BouncesSteps'
import MailerMessagesSteps from './MailerMessagesSteps'
import CreateCampaignSteps from './CreateCampaignSteps'
import EditCampaignSteps from './EditCampaignSteps'

export const tourPaths = {
  '/': 'Dashboard',
  '/subscribers': 'Subscribers',
  '/lists': 'Lists',
  '/topics': 'Topics',
  '/campaigns': 'Campaigns',
  '/planning': 'Planning',
  '/bounces': 'Bounces',
  '/logs': 'MailerMessages',
  '/campaigns/create': 'CreateCampaign'
}

export const tourRegExps = {
  EditCampaign: '^/campaigns/edit/[0-9]+$'
}

export default {
  Dashboard: DashboardSteps,
  Subscribers: SubscribersSteps,
  Lists: ListsSteps,
  Topics: TopicsSteps,
  Campaigns: CampaignsSteps,
  Planning: PlanningSteps,
  Bounces: BouncesSteps,
  MailerMessages: MailerMessagesSteps,
  CreateCampaign: CreateCampaignSteps,
  EditCampaign: EditCampaignSteps
}
