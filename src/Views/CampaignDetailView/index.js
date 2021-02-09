import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import { Link } from 'react-router-dom'
import ContentLoader from '../../Components/ContentLoader'
import DispatchDetail from '../../Components/DispatchDetail'
import {
  Segment,
  Container,
  Label,
  Icon,
  Header,
  Grid,
  Message,
  Checkbox,
  Tab
} from 'semantic-ui-react'
import { withLoader } from '../../HOC/Loader'
import config from '../../Config'
import { request } from '../../Services/Request'
import { layoutProps } from '../../Styles/Common'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import styles from './CampaignDetailView.module.scss'

const CampaignDetailView = props => {
  const { t } = useTranslation()
  const id = props.match.params ? parseInt(props.match.params.id) : null
  const campaigns = useSelector(state => state.campaigns.data)
  const campaign = id ? campaigns.filter(c => c.id === id)[0] : {}
  const [viewTest, setViewTest] = useState(false)
  const [dispatches, setDispatches] = useState({
    fetched: false,
    error: false,
    data: []
  })

  const fetchDispatches = useCallback(() => {
    request(
      'campaignDispatches',
      [id],
      t('There was an error retrieving the campaign dispatches') + ': {error}',
      response => {
        setDispatches({ fetched: true, data: response.data, error: false })
      },
      error => {
        console.log(error)
        setDispatches({ fetched: true, data: [], error: true })
      }
    )
  }, [id, setDispatches, t])

  useEffect(() => {
    if (id) {
      fetchDispatches()
    }
  }, [id, fetchDispatches])

  const dispatchesSection = ({ fetched, error, data }) => {
    if (fetched && !error && !data.length) {
      return (
        <Message info>
          <Message.Header>{t('Dispatches')}</Message.Header>
          <p>
            {t('The campaign was never sent')}
            <br />
            <Link to={config.urls.sendCampaign.replace(':id', campaign.id)}>
              {t('Send now')}
            </Link>
          </p>
        </Message>
      )
    } else if (!fetched) {
      return <ContentLoader />
    } else {
      const panes = data.filter(d => (d.test && viewTest) || (!d.test && !viewTest)).map(d => ({
        menuItem: moment(d.started_at).format('MMM DD YYYY, HH:mm'),
        render: () => <DispatchDetail dispatch={d} onChange={fetchDispatches} />
      }))
      return (
        <div>
          <Header>
            {t('Dispatches')}
          </Header>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Checkbox data-tour='campaign-detail-view-test' toggle onChange={(e, { checked }) => setViewTest(checked)} />
            <span style={{ marginLeft: '.5rem' }}>{t('View test dispatches')}</span>
          </div>
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        </div>
      )
    }
  }

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <Container {...layoutProps.containerProps}>
        {withLoader(
          () => (
            <Segment {...layoutProps.segmentProps}>
              <Label {...layoutProps.labelProps}>
                <Icon name='chart line' /> {campaign ? campaign.name : ''}
              </Label>
              <Grid stackable doubling columns={2}>
                <Grid.Row>
                  <Grid.Column width={5}>
                    <p style={{ lineHeight: '2rem' }} data-tour='campaign-detail-general-info'>
                      <strong>{t('Oggetto')}</strong>: {campaign.subject}
                      <br />
                      <strong>{t('Topic')}</strong>: {campaign.topic}
                      <br />
                      <strong>{t('Created')}</strong>:{' '}
                      {moment(campaign.insertion_datetime).format('LLL')}
                      <br />
                      <strong>{t('Last edit')}</strong>:{' '}
                      {moment(campaign.last_edit_datetime).format('LLL')}
                      <br />
                      <strong>{t('View online')}</strong>:{' '}
                      {campaign.view_online ? (
                        [
                          <Icon key='icon' name='thumbs up' color='green' />,
                          <a key='link' target='_blank' href={campaign.url} rel='noopener noreferrer'>
                            <Icon
                              key='link'
                              name='external alternate'
                              color='green'
                            />
                          </a>
                        ]
                      ) : (
                        <Icon name='thumbs down' color='red' />
                      )}
                    </p>
                  </Grid.Column>
                  <Grid.Column width={11} data-tour='campaign-detail-dispatches'>
                    {dispatchesSection(dispatches)}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          ),
          id && campaigns.length === 0
        )}
      </Container>
    </BaseLayout>
  )
}

CampaignDetailView.propTypes = {
  match: PropTypes.object
}

export default CampaignDetailView
