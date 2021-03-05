import React from 'react'
import { useSelector } from 'react-redux'
import { Header, Icon, Statistic } from 'semantic-ui-react'
import { withLoader } from '../../HOC/Loader'
import { withData } from '../../HOC/Empty'
import { useTranslation } from 'react-i18next'
import history from '../../history'
import config from '../../Config'

import styles from './DispatchesWidget.module.scss'

const DispatchesWidget = (props) => {
  const { t } = useTranslation()
  const stats = useSelector((state) => state.stats.data)
  const isLoading = useSelector((state) => state.stats.fetching)

  const content = (stats) => (
    <Statistic color='green' size='huge'>
      <Statistic.Value>{stats.dispatching}</Statistic.Value>
    </Statistic>
  )

  return (
    <div className={styles.widget} data-tour='dispatches-widget'>
      <Header as='h2' icon>
        <Icon name='mail outline' link className={styles.icon} onClick={() => history.push(config.urls.mailerMessages)} />
        {t('Logs')}
        <Header.Subheader>
          {t('Enqueued e-mails ready for dispatching')}
        </Header.Subheader>
      </Header>
      {withLoader(
        withData(content, stats, stats.subscribers && stats.subscribers !== null),
        isLoading && (!stats.subscribers || stats.subscribers.length === 0)
      )}
    </div>
  )
}

DispatchesWidget.propTypes = {}

export default DispatchesWidget
