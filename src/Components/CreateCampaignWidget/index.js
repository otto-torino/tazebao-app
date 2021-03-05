import React from 'react'
import { Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import config from '../../Config'
import { useTranslation } from 'react-i18next'
import history from '../../history'

import styles from './CreateCampaignWidget.module.scss'

const CreateCampaignWidget = (props) => {
  const { t } = useTranslation()
  return (
    <div className={styles.widget} data-tour='campaigns-widget'>
      <Header as='h2' icon>
        <Icon name='newspaper outline' className={styles.icon} link onClick={() => history.push(config.urls.campaigns)} />
        {t('Campaigns')}
        <Header.Subheader>{t('Compose and send your campaign')}</Header.Subheader>
      </Header>
      <Link to={config.urls.createCampaign}>
        <Icon name='add circle' size='huge' color='blue' />
      </Link>
    </div>
  )
}

CreateCampaignWidget.propTypes = {}

export default CreateCampaignWidget
