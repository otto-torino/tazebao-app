import React, { useState, useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import Datetime from 'react-datetime'
import { toast } from 'react-toastify'
import MultipleChoiceField from '../../Components/MultipleChoiceField'
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
  Popup
} from 'semantic-ui-react'
import { withLoader } from '../../HOC/Loader'
import { layoutProps } from '../../Styles/Common'
import history from '../../history'
import config from '../../Config'
import { request } from '../../Services/Request'

import styles from './SendCampaignView.module.scss'

const SendCampaignView = props => {
  const id = props.match.params ? parseInt(props.match.params.id) : null
  const campaigns = useSelector(state => state.campaigns.data)
  const lists = useSelector(state => state.lists.data)
  const campaign = id ? campaigns.filter(c => c.id === id)[0] : null
  const [selectedLists, setSelectedLists] = useState([])
  const [selectedDatetime, setSelectedDatetime] = useState(null)
  const handleListsField = useCallback(value => {
    setSelectedLists(value)
  })

  const selectedSubscribers = Object.keys(lists).reduce(
    (acc, current) =>
      selectedLists.indexOf(parseInt(current)) !== -1
        ? acc + lists[current].tot_subscribers
        : acc,
    0
  )

  const handleDatetimeScheduling = useCallback(dt => {
    setSelectedDatetime(dt)
  })

  const handleSetScheduling = useCallback(() => {
    const p = {
      campaign: campaign.id,
      lists: selectedLists,
      schedule: selectedDatetime.format('YYYY-MM-DD HH:mm:ss')
    }
    request(
      'addPlanning',
      [p],
      'Cannot add the scheduling',
      response => {
        // show toast and redirect to home
        toast.success('The scheduling was suceesfully set, redirecting to the home page...')
        setTimeout(() => history.push(config.urls.home), 2000)
      },
      error => console.log(error)
    )
  })

  const handleSendNow = useCallback(() => {
    if (!selectedSubscribers) {
      return
    }
    request(
      'sendCampaign',
      [campaign.id, selectedLists],
      'Cannot send the campaign: {error}',
      response => {
        // show toast and redirect to home
        toast.success('The campaign will be sent in the next minutes!')
        setTimeout(() => history.push(config.urls.home), 2000)
      },
      error => console.log(error)
    )
  }, [selectedSubscribers])

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <Container {...layoutProps.containerProps}>
        {withLoader(
          <Segment {...layoutProps.segmentProps}>
            <Label {...layoutProps.labelProps}>
              <Icon name='send' />{' '}
              {campaign ? campaign.name : ''}
            </Label>
            <div>
              <Header as='h2' icon color='blue' textAlign='center' style={{ marginBottom: '2rem' }}>
                1<br />
                <Icon name='users' />
                Choose your list
                <Header.Subheader>
                  If a subscriber belongs to more than one list, it'll receive the e-mail twice
                </Header.Subheader>
              </Header>
              <Grid padded centered stackable columns={2}>
                <Grid.Row>
                  <Grid.Column
                    textAlign='center'
                    verticalAlign='middle'
                    widescreen={3}
                  >
                    <Statistic color='teal' size='huge'>
                      <Statistic.Value>{selectedSubscribers}</Statistic.Value>
                      <Statistic.Label>Total e-mails</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column
                    textAlign='center'
                    verticalAlign='middle'
                    widescreen={3}
                  >
                    <div style={{ display: 'inline-block', textAlign: 'left' }}>
                      <MultipleChoiceField
                        items={Object.keys(lists).map(id => ({
                          value: lists[id].id,
                          label: lists[id].name
                        }))}
                        value={selectedLists}
                        onChange={handleListsField}
                      />
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Header as='h2' icon color='blue' textAlign='center' style={{ marginBottom: '2rem', marginTop: '4rem' }}>
                2<br />
                <Icon name='mail outline' />
                Send
                <Header.Subheader>
                  You can send it now or later on
                </Header.Subheader>
              </Header>
              <div
                style={{
                  position: 'relative',
                  marginTop: '4rem',
                  marginBottom: '3rem'
                }}
              >
                <Grid centered stackable doubling columns={2}>
                  <Grid.Row>
                    <Grid.Column
                      textAlign='center'
                      verticalAlign='middle'
                      widescreen={4}
                      largeScreen={4}
                      tablet={6}
                    >
                      <p style={{ fontSize: '1.4rem' }}>Immediately</p>
                      <p>
                        {selectedSubscribers ? (
                          <span>
                            <Popup
                              basic
                              content='Starting when the process is taken over, that depends on the state of the queue at the moment.'
                              trigger={<Icon color='blue' name='info circle' />}
                            />{' '}
                            It will take about{' '}
                            {Math.ceil(selectedSubscribers / 50) + 1} min
                          </span>
                        ) : null}
                      </p>
                      <Icon
                        size='huge'
                        name='send'
                        circular
                        color='green'
                        disabled={!selectedSubscribers}
                        onClick={handleSendNow}
                        style={{ cursor: selectedSubscribers ? 'pointer' : '' }}
                      />
                    </Grid.Column>
                    <Grid.Column
                      textAlign='center'
                      widescreen={4}
                      largeScreen={4}
                      tablet={6}
                    >
                      <Responsive
                        as={Divider}
                        horizontal
                        style={{ marginBottom: '3rem' }}
                        maxWidth={Responsive.onlyTablet.maxWidth}
                      >
                        OR
                      </Responsive>
                      <p style={{ fontSize: '1.4rem' }}>Schedule</p>
                      {selectedDatetime ? (
                        <Button
                          animated='fade'
                          color='green'
                          disabled={!selectedSubscribers}
                          style={{ margin: '1rem 0' }}
                          onClick={handleSetScheduling}
                        >
                          <Button.Content visible>
                            <Icon name='clock' />{' '}
                            {selectedDatetime.format('LLL')}
                          </Button.Content>
                          <Button.Content hidden>
                            <Icon name='send' /> Set scheduling
                          </Button.Content>
                        </Button>
                      ) : (
                        <p>Select date and time</p>
                      )}
                      <div
                        style={{
                          marginLeft: '1rem',
                          display: 'inline-block',
                          maxWidth: '100%',
                          width: '500px'
                        }}
                      >
                        <Datetime
                          open
                          input={false}
                          onChange={handleDatetimeScheduling}
                          isValidDate={current =>
                            current.isAfter(
                              Datetime.moment().subtract(1, 'day')
                            )}
                        />
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Responsive
                  as={Divider}
                  vertical
                  minWidth={Responsive.onlyTablet.maxWidth}
                >
                  OR
                </Responsive>
              </div>
            </div>
          </Segment>,
          id && campaigns.length === 0
        )}
      </Container>
    </BaseLayout>
  )
}

SendCampaignView.propTypes = {
  match: PropTypes.object
}

export default SendCampaignView
