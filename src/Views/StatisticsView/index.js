import React from 'react'
import { Container, Grid, Icon, Label, Segment } from 'semantic-ui-react'
import { layoutProps } from '../../Styles/Common'
import BaseLayout from "../../Layouts/BaseLayout"

import styles from './StatisticsView.module.scss'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { withLoader } from '../../HOC/Loader'
import SubscriptionsStatisticsChart from '../../Components/SubscriptionsStatisticsChart'
import UnsubscriptionsStatisticsChart from '../../Components/UnsubscriptionsStatisticsChart'

const StatisticsView = () => {
  const { t } = useTranslation()

  const isLoading = useSelector(state => state.subscriptionsStatistics.fetching)
  const data = useSelector(state => state.subscriptionsStatistics.data)

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <Container {...layoutProps.containerProps}>
        <Segment {...layoutProps.segmentProps}>
          <Label {...layoutProps.labelProps}>
            <Icon name='line chart' /> {t('Statistics')}
          </Label>
          {withLoader(
            () => (
              <Grid stackable doubling columns={1}>
                <Grid.Row>
                  <Grid.Column width={16} data-tour='subscriptions-statistics'>
                    <SubscriptionsStatisticsChart data={data} />
                  </Grid.Column>
                  <Grid.Column width={16} data-tour='unsubscriptions-statistics'>
                    <UnsubscriptionsStatisticsChart data={data} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            ),
            isLoading
          )}
        </Segment>
      </Container>
    </BaseLayout>
  )
}

export default StatisticsView
