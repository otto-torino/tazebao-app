import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import config from '../../Config'
import { useTranslation } from 'react-i18next'

const AppMenu = props => {
  const { t } = useTranslation()
  return [
    <Menu.Item active header key='menu'>Menu</Menu.Item>,
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
    <Menu.Item as={Link} to={config.urls.integration} key='menu-voice-integration'>
      <Icon name='globe' />
      {t('Integration')}
    </Menu.Item>
  ]
}

AppMenu.propTypes = {

}

export default AppMenu
