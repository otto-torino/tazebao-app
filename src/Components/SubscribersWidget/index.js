import React from 'react'
import { useSelector } from 'react-redux'
import { Header, Statistic, Icon } from 'semantic-ui-react'
import { withLoader } from '../../HOC/Loader'
import { withData } from '../../HOC/Empty'
import propTypes from 'prop-types'

import styles from './SubscribersWidget.module.scss'

const SubscribersWidget = props => {
  const stats = useSelector(state => state.stats.data)
  const isLoading = useSelector(state => state.stats.fetching)

  const content = stats => (
    <Statistic color='teal'>
      <Statistic.Value>{stats.subscribers}</Statistic.Value>
      <Statistic.Label>
        Last month: {stats.lastMonthSubscribers}
      </Statistic.Label>
    </Statistic>
  )
  return (
    <div className={styles.widget}>
      <Header textAlign='center' as='h2'>
        <Icon name='users' className={styles.icon} /> Subscribers
      </Header>
      {withLoader(withData(content, stats, stats.subscribers && stats.subscribers !== null), isLoading && (!stats.subscribers || stats.subscribers.length === 0))}
    </div>
  )
}

SubscribersWidget.propTypes = {}

export default SubscribersWidget
