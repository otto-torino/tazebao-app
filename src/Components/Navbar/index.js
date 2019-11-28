import React from 'react'
import { Menu, Image, Icon, Dropdown, Responsive } from 'semantic-ui-react'
import AuthActions from '../../Redux/Auth'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Logo from '../../Assets/img/logo.png'
import LogoMobile from '../../Assets/img/logo-mobile.png'
import config from '../../Config'
import PropTypes from 'prop-types'

import styles from './Navbar.module.scss'

const Navbar = props => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const trigger = <span><Icon name='user' /> {user.userName}</span>
  const handleLogout = (e, { value }) => {
    dispatch(AuthActions.logout())
  }
  return (
    <Menu secondary inverted size='huge' className={styles.navbar}>
      <Menu.Item>
        <Icon name='bars' size='big' onClick={props.onHamburgerClick} style={{ cursor: 'pointer', marginRight: 0 }} />
      </Menu.Item>
      <Menu.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Link to={config.urls.home}>
          <Responsive as={Image} className={styles.logo} src={Logo} minWidth={500} />
          <Responsive as={Image} className={styles.logo} src={LogoMobile} maxWidth={500} />
        </Link>
      </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item className='actions-menu'>
          <Dropdown trigger={trigger} pointing className='link item'>
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
