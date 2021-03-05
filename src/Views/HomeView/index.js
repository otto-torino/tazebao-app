import React from 'react'
import { useDispatch } from 'react-redux'
import StatsActions from '../../Redux/Stats'
import BaseLayout from '../../Layouts/BaseLayout'
import Dashboard from '../../Components/Dashboard'
import styles from './HomeView.module.scss'
import config from '../../Config'

const HomeView = props => {
  const dispatch = useDispatch()

  let rt
  React.useEffect(() => {
    rt = setInterval(() => {
      dispatch(StatsActions.statsRequest())
    }, config.refreshStatsInterval)

    return () => clearInterval(rt)
  })

  return (
    <BaseLayout wrapperStyle={styles.homeView} segmentStyle={styles.homeSegment}>
      <div className={styles.container}>
        <Dashboard />
      </div>
    </BaseLayout>
  )
}

export default HomeView
