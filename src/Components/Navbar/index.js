import React from 'react'
import { Menu, Image, Icon, Dropdown, Responsive } from 'semantic-ui-react'
import AuthActions from '../../Redux/Auth'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Logo from '../../Assets/img/logo.png'
import LogoMobile from '../../Assets/img/logo-mobile.png'
import config from '../../Config'
import TourActions from '../../Redux/Tour'
import { tourPaths, tourRegExps } from '../../Tour'
import EventDispatcher from '../../Services/EventDispatcher'
import PropTypes from 'prop-types'
import _ from 'lodash'

import styles from './Navbar.module.scss'

const Navbar = (props) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  // tour
  const path = useSelector((state) => state.router.location.pathname)
  let tour = tourPaths[path]
  if (tour === undefined) {
    // use regexp
    tour = _.head(
      Object.keys(tourRegExps).filter((name) => {
        const re = new RegExp(tourRegExps[name])
        return re.test(path)
      })
    )
  }

  const trigger = (
    <span>
      <Icon name='user' /> {user.userName}
    </span>
  )
  const handleLogout = () => {
    dispatch(AuthActions.logout())
  }

  const openHelp = () => {
    EventDispatcher.emit('closeSidebar')
    dispatch(TourActions.openTour(tour))
  }

  return (
    <Menu secondary inverted size='huge' className={styles.navbar}>
      <Menu.Item className={styles.toastItem}>
        <Icon name='bars' size='big' onClick={props.onHamburgerClick} className={styles.toast} data-tour='menu-icon' />
      </Menu.Item>
      <Menu.Item className={styles.logoItem}>
        <Link to={config.urls.home}>
          <Responsive as={Image} className={styles.logo} src={Logo} minWidth={500} data-tour='logo' />
          <Responsive as={Image} className={styles.logo} src={LogoMobile} maxWidth={500} data-tour='logo' />
        </Link>
      </Menu.Item>
      <Menu.Menu position='right'>
        {tour && (
          <Menu.Item
            as='a'
            onClick={openHelp}
            key='menu-voice-help'
            data-tour='help-button'
            style={{ margin: 0, paddingRight: 0 }}
          >
            <Icon circular name='help' color='blue' inverted size='small' />
          </Menu.Item>
        )}
        <Menu.Item style={{ marginLeft: 0, paddingLeft: 0 }}>
          <Dropdown trigger={trigger} pointing className='link item' data-tour='profile'>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}

Navbar.propTypes = {
  onHamburgerClick: PropTypes.func.isRequired
}

export default Navbar
