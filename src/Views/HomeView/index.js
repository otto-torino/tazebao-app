import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import config from '../../Config'
import history from '../../history'
import styles from './HomeView.module.css'

const HomeView = props => {
  return (
    <BaseLayout wrapperStyle={styles.homeView}>
      <div>
        <h1 as='h1'>Home</h1>
      </div>
    </BaseLayout>
  )
}

export default HomeView
