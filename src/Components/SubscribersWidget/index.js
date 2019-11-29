import React from 'react'
import { useSelector } from 'react-redux'
import { Header, Statistic, Icon, Grid } from 'semantic-ui-react'
import { withLoader } from '../../HOC/Loader'
import { withData } from '../../HOC/Empty'
import propTypes from 'prop-types'

import styles from './SubscribersWidget.module.scss'

const SubscribersWidget = props => {
  const stats = useSelector(state => state.stats.data)
  const isLoading = useSelector(state => state.stats.fetching)

  const content = stats => (
    <Statistic color='teal' size='huge'>
      <Statistic.Value>{stats.subscribers}</Statistic.Value>
    </Statistic>
  )

  const contentMonth = stats => (
    <Grid columns={2} style={{ textAlign: 'center' }}>
      <Grid.Row>
        <Grid.Column>
          <Statistic color='green'>
            <Statistic.Value>
              <Icon name='arrow up' color='green' size='tiny' style={{ position: 'relative', bottom: '12px', left: '-10px' }} />
              {stats.lastMonthSubscribers}
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic color='red'>
            <Statistic.Value>
              {stats.lastMonthUnsubscriptions}
              <Icon name='arrow down' color='red' size='tiny'  style={{ position: 'relative', bottom: '12px', right: '-10px' }}/>
            </Statistic.Value>
          </Statistic>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

  return (
    <div className={styles.widget}>
      <Header as='h2' icon>
        <Icon name='users' className={styles.icon} />
        Subscribers
        <Header.Subheader>
          Total and last month stats
        </Header.Subheader>
      </Header>
      {withLoader(withData(content, stats, stats.subscribers && stats.subscribers !== null), isLoading && (!stats.subscribers || stats.subscribers.length === 0))}
      <Header as='h2' icon size='small'>
        <Icon name='calendar alternate outline' className={styles.icon} />
        Last Month
      </Header>
      {withLoader(withData(contentMonth, stats, stats.subscribers && stats.subscribers !== null), isLoading && (!stats.subscribers || stats.subscribers.length === 0))}
    </div>
  )
}

SubscribersWidget.propTypes = {}

export default SubscribersWidget
