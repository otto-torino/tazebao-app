import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import moment from 'moment'
import OpenRateLabel from '../OpenRateLabel'
import { Table, Label, Popup, Icon, Button, Modal, Grid } from 'semantic-ui-react'
import OpenTrackingTable from '../OpenTrackingTable'
import ClickTrackingTable from '../ClickTrackingTable'
import RatePieChart from '../RatePieChart'
import StatisticsTimelineChart from '../StatisticsTimelineChart'
import BouncesTable from '../BouncesTable'
import { useTranslation } from 'react-i18next'
import { request } from '../../Services/Request'

const DispatchDetail = ({ dispatch, onChange }) => {
  const { t } = useTranslation()
  const lists = useSelector(state => state.lists.data)
  const [trackOpenModalIsOpen, setTrackOpenModalIsOpen] = useState(false)
  const [trackClickModalIsOpen, setTrackClickModalIsOpen] = useState(false)
  const [bouncesModalIsOpen, setBouncesModalIsOpen] = useState(false)
  const [selectedBounces, setSelectedBounces] = useState([])

  const handleDeleteBounces = useCallback(() => {
    return request(
      'deleteSubscribersFromBounces',
      [selectedBounces],
      t('There was an error removing the subscribers'),
      response => {
        onChange()
        setBouncesModalIsOpen(false)
      }
    )
  }, [selectedBounces, t, onChange, setBouncesModalIsOpen])

  const dispatchListsLength = dispatch.lists.length

  return (
    <div>
      <p>{t('Information about the campaign dispatch')}</p>
      <Table definition>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{t('Start')}</Table.Cell>
            <Table.Cell>{moment(dispatch.started_at).format('LLL')}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{t('Lists')}</Table.Cell>
            <Table.Cell>
              {dispatch.lists.map((l, idx) => lists[l] ? <span>{lists[l].name}, </span> : <span><s>{t('Deleted')}</s>{dispatchListsLength - 1 === idx ? '' : ', '}</span>)}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{t('E-mail sent')}</Table.Cell>
            <Table.Cell>{dispatch.sent}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              {t('Bounces')}{' '}
              <Popup
                basic
                content={t('Bounces are cleared every week')}
                trigger={<Icon color='blue' name='info circle' />}
              />
            </Table.Cell>
            <Table.Cell>
              <Label color='teal'>{dispatch.bounces.length}</Label>{' '}
              {!!dispatch.bounces.length && (
                <Icon
                  color='blue'
                  style={{ cursor: 'pointer' }}
                  name='bullseye'
                  onClick={() => setBouncesModalIsOpen(true)}
                />
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{t('Result')}</Table.Cell>
            <Table.Cell>
              <Label color={dispatch.error ? 'red' : 'green'}>
                {dispatch.error ? t('Error') : t('Success')}
              </Label>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{t('Open rate')}</Table.Cell>
            <Table.Cell>
              <OpenRateLabel rate={dispatch.open_rate} />{' '}
              <Icon
                color='blue'
                style={{ cursor: 'pointer' }}
                name='bullseye'
                onClick={() => setTrackOpenModalIsOpen(true)}
              />
            </Table.Cell>
          </Table.Row>
          {dispatch.click_statistics && (
            <Table.Row>
              <Table.Cell>{t('Click rate')}</Table.Cell>
              <Table.Cell>
                <Label color='teal'>{dispatch.click_rate}%</Label>{' '}
                <Icon
                  color='blue'
                  style={{ cursor: 'pointer' }}
                  name='bullseye'
                  onClick={() => setTrackClickModalIsOpen(true)}
                />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {trackOpenModalIsOpen && (
        <Modal open size='small' onClose={() => setTrackOpenModalIsOpen(false)}>
          <Modal.Header>{t('Open events')}</Modal.Header>
          <Modal.Content scrolling>
            <OpenTrackingTable events={dispatch.trackings.filter(t => t.type === 'apertura')} />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setTrackOpenModalIsOpen(false)}>
              {t('Close')}
            </Button>
          </Modal.Actions>
        </Modal>
      )}
      {trackClickModalIsOpen && (
        <Modal open size='small' onClose={() => setTrackClickModalIsOpen(false)}>
          <Modal.Header>{t('Click events')}</Modal.Header>
          <Modal.Content scrolling>
            <ClickTrackingTable events={dispatch.trackings.filter(t => t.type === 'click')} />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setTrackClickModalIsOpen(false)}>
              {t('Close')}
            </Button>
          </Modal.Actions>
        </Modal>
      )}
      {bouncesModalIsOpen && (
        <Modal open onClose={() => setBouncesModalIsOpen(false)}>
          <Modal.Header>{t('Bounces')}</Modal.Header>
          <Modal.Content scrolling>
            <BouncesTable
              bounces={dispatch.bounces}
              onSelectionChange={selected => {
                setSelectedBounces(selected)
              }}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setBouncesModalIsOpen(false)}>
              {t('Close')}
            </Button>
            <Button disabled={!selectedBounces.length} onClick={handleDeleteBounces} color='red'>
              <Icon name='trash alternate' />
              {t('Remove selected subscribers')}
            </Button>
          </Modal.Actions>
        </Modal>
      )}
      {!dispatch.error && (
        <Grid doubling stackable columns={2} style={{ marginTop: '2rem' }}>
          <Grid.Row>
            <Grid.Column width={10}>
              <StatisticsTimelineChart
                title={t('Open through time')}
                label={t('Open acc')}
                data={dispatch.trackings.filter(t => t.type === 'apertura')} />
            </Grid.Column>
            <Grid.Column width={6}>
              <RatePieChart
                title={t('Open Statistics')}
                label={t('Open Rate')}
                trueLabel={t('Open e-mails')}
                falseLabel={t('Unopened e-mails')}
                data={dispatch.open_rate}
              />
            </Grid.Column>
          </Grid.Row>
          {dispatch.click_statistics && (
            <Grid.Row>
              <Grid.Column width={6}>
                <RatePieChart
                  title={t('Click Statistics')}
                  label={t('Click Rate')}
                  trueLabel={t('One or more click')}
                  falseLabel={t('No clicks')}
                  data={dispatch.click_rate}
                />
              </Grid.Column>
              <Grid.Column width={10}>
                <StatisticsTimelineChart
                  title={t('Click through time')}
                  label={t('Clicks')}
                  data={dispatch.trackings.filter(t => t.type === 'click')} />
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      )}
    </div>
  )
}

DispatchDetail.propTypes = {
  dispatch: PropTypes.object,
  onChange: PropTypes.func
}

export default DispatchDetail
