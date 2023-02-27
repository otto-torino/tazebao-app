import React, { useState } from 'react'
// import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import CampaignsActions from '../../Redux/Campaigns'
import BaseLayout from '../../Layouts/BaseLayout'
import {
  Segment,
  Container,
  Label,
  Icon,
  Modal,
  Button
} from 'semantic-ui-react'
import { ChangeList } from '../../Lib/react-admin'
import { request } from '../../Services/Request'
import { layoutProps } from '../../Styles/Common'
import config from '../../Config'
import history from '../../history'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import styles from './CampaignsView.module.scss'

const CampaignsView = props => {
  const { t } = useTranslation()
  const [deleteModal, setDeleteModal] = useState({ open: false })
  const dispatch = useDispatch()
  const campaigns = useSelector(state => state.campaigns.data)
  const isWholeDataSet = useSelector(state => state.campaigns.isWholeDataSet)
  const querystring = useSelector(state => state.campaigns.qs)
  const campaignsCount = useSelector(state => state.campaigns.count)
  const isLoading = useSelector(state => state.campaigns.fetching)
  const topics = useSelector(state => state.topics.data)

  const listDisplay = [
    'id',
    'name',
    'topic',
    'last_edit_datetime',
    'last_not_test_dispatch',
    'subject',
    'view_online'
  ]

  const handleInsert = data => history.push(config.urls.createCampaign)
  const handleEdit = item => {
    if (item.template) {
      history.push(config.urls.editCampaign.replace(':id', item.id))
    }
  }

  const handleDelete = campaign =>
    setDeleteModal({ open: true, item: campaign })

  const deleteCampaign = id => {
    return request(
      'deleteCampaign',
      [id],
      t('There was an error deleting the campaign') + ': {error}',
      response => {
        dispatch(CampaignsActions.campaignsRequest())
        setDeleteModal({ open: false })
      }
    )
  }

  const handleDuplicate = item => {
    return request(
      'duplicateCampaign',
      [item.id],
      t('There was an error duplicating the campaign') + ': {error}',
      response => {
        toast.success(
          t('The campaign was succesfully duplicated, redirecting to edit page...')
        )
        dispatch(CampaignsActions.campaignsRequest())
        setTimeout(() => {
          history.push(
            config.urls.editCampaign.replace(':id', response.data.id)
          )
        }, 2000)
      }
    )
  }

  const description = (
    <p>{t('admin_campaign_description')}</p>
  )

  const deleteModalComponent = item => (
    <Modal open size='small' onClose={() => setDeleteModal({ open: false })}>
      <Modal.Header>{t('Delete campaign')}: {item.name}</Modal.Header>
      <Modal.Content>
        <p>{t('Deleted items cannot be restored. Proceed?')}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color='red'
          inverted
          onClick={() => setDeleteModal({ open: false })}
        >
          <Icon name='remove' /> {t('Cancel')}
        </Button>
        <Button color='green' inverted onClick={() => deleteCampaign(item.id)}>
          <Icon name='trash alternate' /> {t('Delete')}
        </Button>
      </Modal.Actions>
    </Modal>
  )

  const topicFilters = Object.keys(topics).length
    ? {
      topic: {
        label: t('topic'),
        options: [
          { value: null, text: t('All topics'), key: 0 },
          ...Object.keys(topics).map(id => ({
            value: id,
            text: topics[id].name,
            key: id
          }))
        ],
        filter: (record, value) => {
          return record.topic_id === parseInt(value)
        }
      }
    }
    : {}

  const handleUpdateQuerystring = qs => {
    dispatch(CampaignsActions.campaignsQuerystring(qs))
  }

  const listActions = {
    compare: {
      label: t('Compare statistics'),
      action: ids => {
        history.push(config.urls.campaignsStatistics, { ids })
      },
      options: { setPage: 1 }
    }
  }

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <Container {...layoutProps.containerProps}>
        <Segment {...layoutProps.segmentProps}>
          <Label {...layoutProps.labelProps}>
            <Icon name='newspaper outline' /> {t('Campaigns')}
          </Label>
          <ChangeList
            onInsert={handleInsert}
            onEdit={handleEdit}
            canEdit={item => item.template && !item.last_not_test_dispatch}
            description={description}
            onDelete={handleDelete}
            items={campaigns}
            isLoading={isLoading}
            listFilters={topicFilters}
            listDisplay={listDisplay}
            listActions={listActions}
            idProp='id'
            verboseName={t('campaign')}
            verboseNamePlural={t('campaigns')}
            searchFields={['name']}
            sortableFields={['id', 'name', 'topic', 'last_edit_datetime', 'subject', 'view_online']}
            moreActions={item => [
              <Icon
                title={t('details')}
                name='chart line'
                circular
                data-tour='changelist-stats'
                color='blue'
                onClick={() => history.push(config.urls.campaignDetail.replace(':id', item.id))}
                key='detail-btn'
                style={{
                  cursor: 'pointer'
                }}
              />,
              <Icon
                title={t('duplicate')}
                name='copy outline'
                circular
                disabled={!item.template}
                data-tour='changelist-duplicate'
                color='blue'
                onClick={() => handleDuplicate(item)}
                key='duplicate-btn'
                style={{
                  cursor: !item.template ? 'auto' : 'pointer'
                }}
              />,
              <Icon
                title={t('send')}
                name='send'
                data-tour='changelist-send'
                circular
                color='blue'
                onClick={() =>
                  history.push(config.urls.sendCampaign.replace(':id', item.id))}
                key='send-btn'
                style={{
                  cursor: 'pointer'
                }}
              />
            ]}
            fieldsMapping={{
              last_edit_datetime: dt => moment(dt).format('LLL'),
              last_dispatch: dt => (dt ? moment(dt).format('LLL') : null)
            }}
            isWholeDataSet={isWholeDataSet}
            querystring={querystring}
            dataSetCount={campaignsCount}
            onUpdateQuerystring={handleUpdateQuerystring}
          />
          {deleteModal.open && deleteModalComponent(deleteModal.item)}
        </Segment>
      </Container>
    </BaseLayout>
  )
}

CampaignsView.propTypes = {}

export default CampaignsView
