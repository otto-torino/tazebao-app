import React from 'react'
import { Grid } from 'semantic-ui-react'
import SubscribersWidget from '../SubscribersWidget'
import LastDispatchWidget from '../LastDispatchWidget'
import NextPlanningWidget from '../NextPlanningWidget'
import CreateCampaignWidget from '../CreateCampaignWidget'
import BouncesWidget from '../BouncesWidget'
import DispatchesWidget from '../DispatchesWidget'
// import propTypes from 'prop-types'

const Dashboard = props => {
  return (
    <Grid stackable columns={3}>
      <Grid.Row>
        <Grid.Column>
          <SubscribersWidget />
          <NextPlanningWidget />
        </Grid.Column>
        <Grid.Column>
          <CreateCampaignWidget />
          <LastDispatchWidget />
        </Grid.Column>
        <Grid.Column>
          <BouncesWidget />
          <DispatchesWidget />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

Dashboard.propTypes = {

}

export default React.memo(Dashboard)
