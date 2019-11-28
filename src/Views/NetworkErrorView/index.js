import React from 'react'
import config from '../../Config'
import { Button } from 'semantic-ui-react'

import styles from './NetworkErrorView.module.scss'

const NetworkErrorView = props => {
  return (
    <div className={styles.networkErrorView}>
      <div className={styles.content}>
        <h1>Network Error</h1>
        <p>
          There was an error contacting the data server.
          <br />
          It may be down, or you don't have an active internet connection.
        </p>
        <p style={{ textAlign: 'center' }}>
          <Button color='blue' onClick={() => (window.location.href = config.urls.home)}>
            Retry
          </Button>
        </p>
      </div>
    </div>
  )
}

export default NetworkErrorView
