import React from 'react'
import { Grid } from 'semantic-ui-react'
import SubscribersWidget from '../SubscribersWidget'
import LastDispatchWidget from '../LastDispatchWidget'
import NextPlanningWidget from '../NextPlanningWidget'
import CreateCampaignWidget from '../CreateCampaignWidget'
import propTypes from 'prop-types'

const Dashboard = props => {
  return (
    <Grid doubling stackable columns={2}>
      <Grid.Row>
        <Grid.Column>
          <SubscribersWidget />
          <NextPlanningWidget />
        </Grid.Column>
        <Grid.Column>
          <CreateCampaignWidget />
          <LastDispatchWidget />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

Dashboard.propTypes = {

}

export default Dashboard
