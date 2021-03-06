import React, { useState } from 'react'
import { Sidebar, Menu, Segment } from 'semantic-ui-react'
import MenuVoices from '../Components/Menu'
import Navbar from '../Components/Navbar'
import PropTypes from 'prop-types'

import styles from './BaseLayout.module.scss'

const BaseLayout = props => {
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
        </Sidebar.Pusher>
      </Sidebar.Pushable>
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
