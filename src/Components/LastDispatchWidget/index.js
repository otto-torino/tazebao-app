import React from 'react'
import { useSelector } from 'react-redux'
import { Table, Header, Statistic, Icon, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { withLoader } from '../../HOC/Loader'
import { withData } from '../../HOC/Empty'
import { useTranslation } from 'react-i18next'
import config from '../../Config'
import propTypes from 'prop-types'

import styles from './LastDispatchWidget.module.scss'

const LastDispatchWidget = props => {
  const { t, i18n } = useTranslation()
  const stats = useSelector(state => state.stats.data)
  const isLoading = useSelector(state => state.stats.fetching)

  const content = stats => (
    <div>
      <h3 style={{ textAlign: 'center' }}>
        <Link
          to={config.urls.campaignDetail.replace(
            ':id',
            stats.lastDispatch.campaign
          )}
        >
          {stats.lastDispatch.campaign_name}
        </Link>
      </h3>
      <Table basic='very'>
        <Table.Body>
          <Table.Row>
            <Table.Cell rowSpan={3} textAlign='center'>
              <Statistic color='teal' className={styles.statistic} size='huge'>
                <Statistic.Value>{stats.lastDispatch.sent}</Statistic.Value>
                <Statistic.Label>{t('Sent E-mails')}</Statistic.Label>
              </Statistic>
            </Table.Cell>
            <Table.Cell style={{ padding: 0 }}>
              <Statistic
                color='olive'
                size='mini'
                style={{ alignItems: 'flex-start' }}
                className={styles.statistic}
              >
                <Statistic.Value>
                  <Icon name='folder open' style={{ marginRight: '1rem' }} />
                  {stats.lastDispatch.open_rate}%
                </Statistic.Value>
                <Statistic.Label>{t('Open Rate')}</Statistic.Label>
              </Statistic>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={{ borderTopWidth: 0 }}>
              <Statistic
                color='yellow'
                size='mini'
                style={{ alignItems: 'flex-start' }}
                className={styles.statistic}
              >
                <Statistic.Value>
                  <Icon name='hand pointer' style={{ marginRight: '1rem' }} />
                  {stats.lastDispatch.click_statistics
                    ? stats.last_dispatch.click_rate + '%'
                    : 'N.A.'}
                </Statistic.Value>
                <Statistic.Label>
                  {t('Click Rate')}{' '}
                  {!stats.lastDispatch.click_statistics && (
                    <Popup
                      basic
                      content={t('Click statistics are not available because no links were tracked')}
                      trigger={<Icon color='blue' name='info circle' />}
                    />
                  )}
                </Statistic.Label>
              </Statistic>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell style={{ borderTopWidth: 0 }}>
              <Statistic
                color='orange'
                size='mini'
                style={{ alignItems: 'flex-start' }}
                className={styles.statistic}
              >
                <Statistic.Value>
                  <Icon name='ban' style={{ marginRight: '1rem' }} />
                  {stats.lastDispatch.bounces.length}
                </Statistic.Value>
                <Statistic.Label>
                  Bounces{' '}
                  <Popup
                    basic
                    content={t('Bounces are cleared every week')}
                    trigger={<Icon color='blue' name='info circle' />}
                  />
                </Statistic.Label>
              </Statistic>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  )
  return (
    <div className={styles.widget}>
      <Header as='h2' icon>
        <Icon name='send' className={styles.icon} />
        {t('Last Dispatch')}
        <Header.Subheader>{t('The last dispatch stats')}</Header.Subheader>
      </Header>
      {withLoader(
        withData(
          content,
          stats,
          stats && stats.lastDispatch && stats.lastDispatch.id
        ),
        isLoading && (!stats || !stats.lastDispatch)
      )}
    </div>
  )
}

LastDispatchWidget.propTypes = {}

export default LastDispatchWidget
