import React from 'react'
import BaseLayout from '../../Layouts/BaseLayout'
import Dashboard from '../../Components/Dashboard'
import styles from './HomeView.module.scss'

const HomeView = props => {
  return (
    <BaseLayout wrapperStyle={styles.homeView} segmentStyle={styles.homeSegment}>
      <div className={styles.container}>
        <Dashboard />
      </div>
    </BaseLayout>
  )
}

export default HomeView
