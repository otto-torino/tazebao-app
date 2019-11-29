import React from 'react'
import { Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import config from '../../Config'

import styles from './CreateCampaignWidget.module.scss'

const CreateCampaignWidget = props => {
  return (
    <div className={styles.widget}>

      <Header as='h2' icon>
        <Icon name='newspaper outline' className={styles.icon} />
        Create Campaign
        <Header.Subheader>
          Compose and send your campaign
        </Header.Subheader>
      </Header>
      <Link to={config.urls.createCampaign}>
        <Icon name='add circle' size='huge' color='blue' />
      </Link>
    </div>
  )
}

CreateCampaignWidget.propTypes = {}

export default CreateCampaignWidget
