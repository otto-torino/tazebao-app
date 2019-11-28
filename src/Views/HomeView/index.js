import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Container } from 'semantic-ui-react'
import BaseLayout from '../../Layouts/BaseLayout'
import Dashboard from '../../Components/Dashboard'
import config from '../../Config'
import history from '../../history'
import styles from './HomeView.module.css'

const HomeView = props => {
  return (
    <BaseLayout wrapperStyle={styles.homeView} segmentStyle={styles.homeSegment}>
      <Container>
        <Dashboard />
      </Container>
    </BaseLayout>
  )
}

export default HomeView
