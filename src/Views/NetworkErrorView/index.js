import React from 'react'

import styles from './NetworkErrorView.module.scss'

const NetworkErrorView = props => {
  return (
    <div className={styles.networkErrorView}>
      <div>
          <h1>Network Error</h1>
          <p>There was an error contacting the data server.<br />It may be down, or you don't have an active internet connection.</p>
      </div>
    </div>
  )
}

export default NetworkErrorView
