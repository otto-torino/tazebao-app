import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Menu, Icon, Image } from 'semantic-ui-react'
import Logo from '../../Assets/img/logo-sidebar.png'
import AuthActions from '../../Redux/Auth'
import TourActions from '../../Redux/Tour'
import { tourPaths, tourRegExps } from '../../Tour'
import { Link } from 'react-router-dom'
import EventDispatcher from '../../Services/EventDispatcher'
import config from '../../Config'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import history from '../../history'
import styles from './Menu.module.scss'

const AppMenu = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(AuthActions.logout())
  }

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

  const openHelp = (e) => {
    e.stopPropagation()
    EventDispatcher.emit('closeSidebar')
    dispatch(TourActions.openTour(tour))
  }

  const items = [
    <Menu.Item as='span' key='menu-voice-logo' className={styles.logoItem}>
      <Image
        onClick={() => history.push(config.urls.home)}
        label={
          tour && {
            as: 'div',
            corner: 'right',
            icon: 'help',
            color: 'blue',
            onClick: openHelp,
            'data-tour': 'help-button-desktop'
          }
        }
        src={Logo}
        fluid
        data-tour='logo-desktop'
      />
    </Menu.Item>,
    <Menu.Item as='span' key='menu-voice-links' className={styles.profileItem} data-tour='profile-desktop'>
      <Icon circular name='user' color='teal' inverted style={{ marginLeft: 0 }} />
      <div style={{ marginLeft: '1rem', fontsize: '1.3rem' }}>
        {user.userName}
        <Icon name='sign-out' link style={{ marginLeft: '1rem' }} onClick={handleLogout} />
      </div>
    </Menu.Item>,
    <Menu.Item as={Link} to={config.urls.home} key='menu-voice-home'>
      <Icon name='home' />
      Home
    </Menu.Item>,
    <Menu.Item as={Link} to={config.urls.adminSubscribers} key='menu-voice-admin-users'>
      <Icon name='user' />
      {t('Subscribers')}
    </Menu.Item>,
    <Menu.Item as={Link} to={config.urls.adminLists} key='menu-voice-admin-lists'>
      <Icon name='users' />
      {t('Lists')}
    </Menu.Item>,
    <Menu.Item as={Link} to={config.urls.adminTopics} key='menu-voice-admin-topics'>
      <Icon name='tags' />
      {t('Topics')}
    </Menu.Item>,
    <Menu.Item as={Link} to={config.urls.campaigns} key='menu-voice-campaigns'>
      <Icon name='newspaper outline' />
      {t('Campaigns')}
    </Menu.Item>,
    <Menu.Item as={Link} to={config.urls.planning} key='menu-voice-plannings'>
      <Icon name='clock' />
      {t('Planning')}
    </Menu.Item>,
    <Menu.Item as={Link} to={config.urls.bounces} key='menu-voice-bounces'>
      <Icon name='ban' />
      {t('Bounces')}
    </Menu.Item>,
    <Menu.Item as={Link} to={config.urls.mailerMessages} key='menu-voice-mailer-messages'>
      <Icon name='file text' />
      {t('MailerMessages')}
    </Menu.Item>,
    <Menu.Item as={Link} to={config.urls.integration} key='menu-voice-integration' data-tour='help-menu-voice'>
      <Icon name='globe' />
      {t('Integration')}
    </Menu.Item>
  ]

  return (
    <Menu
      vertical
      inverted
      size='huge'
      style={{ marginBottom: 0, borderRadius: 0, background: 'linear-gradient(138deg, #000, #2b2c2d)' }}
      className={`sidebar-menu ${props.className}`}
    >
      {items}
    </Menu>
  )
}

AppMenu.propTypes = {
  className: PropTypes.string.isRequired
}

export default AppMenu
