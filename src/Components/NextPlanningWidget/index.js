import React from 'react'
import { useSelector } from 'react-redux'
import { Header, Icon } from 'semantic-ui-react'
import { withLoader } from '../../HOC/Loader'
import { withData } from '../../HOC/Empty'
import { useTranslation } from 'react-i18next'
import config from '../../Config'
import history from '../../history'
// import propTypes from 'prop-types'
import moment from 'moment'

import styles from './NextPlanningWidget.module.scss'

const NextPlanningWidget = props => {
  const stats = useSelector(state => state.stats.data)
  const isLoading = useSelector(state => state.stats.fetching)
  const { t } = useTranslation()

  const content = stats => (
    <div>
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {stats.nextPlanning.campaign_name}
      </div>
      <p>{moment(stats.nextPlanning.schedule).format('LLL')}</p>
    </div>
  )

  return (
    <div className={styles.widget} data-tour='planning-widget'>
      <Header as='h2' icon>
        <Icon name='clock' className={styles.icon} link onClick={() => history.push(config.urls.planning)} />
        {t('Planning')}
        <Header.Subheader>
          {t('Next Scheduling')}
        </Header.Subheader>
      </Header>
      {withLoader(
        withData(content, stats, stats.nextPlanning && stats.nextPlanning.id),
        isLoading && (!stats || !stats.nextPlanning)
      )}
    </div>
  )
}

NextPlanningWidget.propTypes = {}

export default NextPlanningWidget
