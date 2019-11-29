import React, { useState, useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import { Link } from 'react-router-dom'
import Datetime from 'react-datetime'
import { toast } from 'react-toastify'
import MultipleChoiceField from '../../Components/MultipleChoiceField'
import ContentLoader from '../../Components/ContentLoader'
import DispatchDetail from '../../Components/DispatchDetail'
import {
  Segment,
  Container,
  Label,
  Icon,
  Divider,
  Header,
  Grid,
  Statistic,
  Button,
  Responsive,
  Popup,
  Message,
  Tab
} from 'semantic-ui-react'
import { withLoader } from '../../HOC/Loader'
import history from '../../history'
import config from '../../Config'
import { request } from '../../Services/Request'
import { layoutProps } from '../../Styles/Common'
import moment from 'moment'

import styles from './CampaignDetailView.module.scss'

const CampaignDetailView = props => {
  const id = props.match.params ? parseInt(props.match.params.id) : null
  const campaigns = useSelector(state => state.campaigns.data)
  const campaign = id ? campaigns.filter(c => c.id === id)[0] : {}
  const [dispatches, setDispatches] = useState({
    fetched: false,
    error: false,
    data: []
  })

  const fetchDispatches = useCallback(() => {
    request(
      'campaignDispatches',
      [id],
      'There was an error retrieving the campaign dispatches: {error}',
      response => {
        setDispatches({ fetched: true, data: response.data, error: false })
      },
      error => {
        setDispatches({ fetched: true, data: [], error: true })
      }
    )
  })

  useEffect(() => {
    if (id) {
      fetchDispatches()
    }
  }, [id])

  const dispatchesSection = ({ fetched, error, data }) => {
    if (fetched && !error && !data.length) {
      return (
        <Message info>
          <Message.Header>Dispatches</Message.Header>
          <p>
            The campaign was never sent
            <br />
            <Link to={config.urls.sendCampaign.replace(':id', campaign.id)}>
              Send now
            </Link>
          </p>
        </Message>
      )
    } else if (!fetched) {
      return <ContentLoader />
    } else {
      const panes = data.map(d => ({
        menuItem: moment(d.started_at).format('MMM DD YYYY, HH:mm'),
        render: () => <DispatchDetail dispatch={d} onChange={fetchDispatches} />
      }))
      return (
        <div>
          <Header>Dispatches</Header>
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
                    <p style={{ lineHeight: '2rem' }}>
                      <strong>Subject</strong>: {campaign.subject}
                      <br />
                      <strong>Topic</strong>: {campaign.topic}
                      <br />
                      <strong>Created</strong>:{' '}
                      {moment(campaign.insertion_datetime).format('LLL')}
                      <br />
                      <strong>Last edit</strong>:{' '}
                      {moment(campaign.last_edit_datetime).format('LLL')}
                      <br />
                      <strong>View online</strong>:{' '}
                      {campaign.view_online ? (
                        [
                          <Icon key='icon' name='thumbs up' color='green' />,
                          <a key='link' target='_blank' href={campaign.url}>
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
                  <Grid.Column width={11}>
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
