import React, { useState, useCallback } from 'react'
import { Sidebar, Menu, Segment } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import MenuVoices from '../Components/Menu'
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

const overflowCorrections = [
  'changelist',
  'changelist-pagination-container'
]

const BaseLayout = props => {
  const dispatch = useDispatch()
  // control sidebar from anywhere
  EventDispatcher.register('openSidebar', () => setNavbarVisibility(true))
  EventDispatcher.register('closeSidebar', () => setNavbarVisibility(false))

  const tourIsOpen = useSelector(state => state.tour.isOpen)
  const tourName = useSelector(state => state.tour.name)
  // overflow is evil for reactour
  const setOverflow = v => el => { if (document.getElementById(el)) document.getElementById(el).style.overflow = v }
  const handleOpenTour = useCallback(target => {
    disableBodyScroll(target)
    overflowCorrections.forEach(setOverflow('visible'))
  }, [])
  const handleCloseTour = useCallback(target => {
    enableBodyScroll(target)
    overflowCorrections.forEach(setOverflow('auto'))
  }, [])

  const [navbarIsVisible, setNavbarVisibility] = useState(false)
  return (
    <div className={props.wrapperStyle}>
      <Sidebar.Pushable
        as={Segment}
        className={props.segmentStyle}
        style={{ flex: 1, border: 0, borderRadius: 0 }}
      >
        <Sidebar
          as={Menu}
          size='large'
          animation='overlay'
          onHide={() => setNavbarVisibility(false)}
          vertical
          visible={navbarIsVisible}
          data-tour='sidebar'
        >
          <MenuVoices />
        </Sidebar>
        <Sidebar.Pusher style={{ flex: 1 }}>
          <Navbar
            onHamburgerClick={() => setNavbarVisibility(!navbarIsVisible)}
          />
          <Segment basic style={{ padding: '2rem 0' }}>
            {props.children}
          </Segment>
          <Footer />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      <Tour
        dispatch={dispatch}
        steps={Steps[tourName]}
        isOpen={tourIsOpen}
        showNavigation={false}
        showButtons={false}
        disableKeyboardNavigation
        onRequestClose={() => dispatch(TourActions.closeTour())}
        onAfterOpen={handleOpenTour}
        onBeforeClose={handleCloseTour}
      />
    </div>
  )
}

BaseLayout.defaultProps = {
  wrapperStyle: 'wrapper',
  segmentStyle: styles.bg
}

BaseLayout.propTypes = {
  wrapperStyle: PropTypes.string,
  segmentStyle: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default BaseLayout
