import React, { useCallback, useEffect } from 'react'
import { Segment } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import Menu from '../Components/Menu'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import PropTypes from 'prop-types'
import EventDispatcher from '../Services/EventDispatcher'
// tour
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import TourActions from '../Redux/Tour'
import Steps from '../Tour'
import Tour from '../Reactour'

import styles from './BaseLayout.module.scss'

const overflowCorrections = ['changelist', 'changelist-pagination-container']

const BaseLayout = (props) => {
  const dispatch = useDispatch()

  const openMenu = () => {
    const isOpen = /open-menu/.test(document.body.className)
    if (!isOpen) {
      document.body.className += ' open-menu'
    }
  }

  const closeMenu = () => {
    document.body.className = document.body.className.replace('open-menu', '')
  }

  const toggleMenu = () => {
    const isOpen = /open-menu/.test(document.body.className)
    return isOpen ? closeMenu() : openMenu()
  }

  useEffect(() => {
    document.body.className = document.body.className.replace('open-menu', '')
  }, [])

  // control sidebar from anywhere
  EventDispatcher.register('openSidebar', openMenu)
  EventDispatcher.register('closeSidebar', closeMenu)

  const tourIsOpen = useSelector((state) => state.tour.isOpen)
  const tourName = useSelector((state) => state.tour.name)
  // overflow is evil for reactour
  const setOverflow = (v) => (el) => {
    if (document.getElementById(el)) document.getElementById(el).style.overflow = v
  }
  const handleOpenTour = useCallback((target) => {
    disableBodyScroll(target)
    overflowCorrections.forEach(setOverflow('visible'))
  }, [])
  const handleCloseTour = useCallback((target) => {
    enableBodyScroll(target)
    overflowCorrections.forEach(setOverflow('auto'))
  }, [])

  return (
    <>
      <Navbar onHamburgerClick={toggleMenu} />
      <div className={styles.wrapper}>
        <Menu className={styles.sidebarMenu} />
        <div className={styles.mainContent}>
          <Segment basic style={{ padding: '2rem 0' }}>
            {props.children}
          </Segment>
          <Footer />
        </div>
        <Tour
          dispatch={dispatch}
          steps={Steps[tourName]}
          isOpen={tourIsOpen}
          maskSpace={10}
          showNavigation={false}
          showButtons={false}
          disableKeyboardNavigation
          onRequestClose={() => dispatch(TourActions.closeTour())}
          onAfterOpen={handleOpenTour}
          onBeforeClose={handleCloseTour}
        />
      </div>
    </>
  )
}

BaseLayout.defaultProps = {
}

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default BaseLayout
