import React from 'react'
import { useSelector } from 'react-redux'
import { Header, Icon, Statistic } from 'semantic-ui-react'
import { withLoader } from '../../HOC/Loader'
import { withData } from '../../HOC/Empty'
import { useTranslation } from 'react-i18next'
import history from '../../history'
import config from '../../Config'

import styles from './BouncesWidget.module.scss'

const BouncesWidget = (props) => {
  const { t } = useTranslation()
  const stats = useSelector((state) => state.stats.data)
  const isLoading = useSelector((state) => state.stats.fetching)

  const content = (stats) => (
    <Statistic color='red' size='huge'>
      <Statistic.Value>{stats.bounces}</Statistic.Value>
    </Statistic>
  )

  return (
    <div className={styles.widget} data-tour='bounces-widget'>
      <Header as='h2' icon>
        <Icon name='ban' link className={styles.icon} onClick={() => history.push(config.urls.bounces)} />
        {t('Bounces')}
        <Header.Subheader>
          {t('Please review your bounces')}
        </Header.Subheader>
      </Header>
      {withLoader(
        withData(content, stats, stats.subscribers && stats.subscribers !== null),
        isLoading && (!stats.subscribers || stats.subscribers.length === 0)
      )}
    </div>
  )
}

BouncesWidget.propTypes = {}

export default BouncesWidget
