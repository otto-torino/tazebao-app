import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
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
import moment from 'moment'

import styles from './CampaignsView.module.scss'

const AdminSubscribersView = props => {
  const [deleteModal, setDeleteModal] = useState({ open: false })
  const dispatch = useDispatch()
  const campaigns = useSelector(state => state.campaigns.data)
  const isLoading = useSelector(state => state.campaigns.fetching)

  const listDisplay = [
    'id',
    'name',
    'topic',
    'last_edit_datetime',
    'last_dispatch',
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
      'There was an error deleting the campaign: {error}',
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
      'There was an error duplicating the campaign: {error}',
      response => {
        toast.success(
          'The campaign was succesfully duplicated, redirecting to edit page...'
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
    <p>
      All your campaigns. You can only edit and duplicate campaigns created with this
      application, and that haven't been already dispatched
    </p>
  )

  const deleteModalComponent = item => (
    <Modal open size='small' onClose={() => setDeleteModal({ open: false })}>
      <Modal.Header>Delete campaign: {item.name}</Modal.Header>
      <Modal.Content>
        <p>Deleted items cannot be restored. Proceed?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color='red'
          inverted
          onClick={() => setDeleteModal({ open: false })}
        >
          <Icon name='remove' /> Cancel
        </Button>
        <Button color='green' inverted onClick={() => deleteCampaign(item.id)}>
          <Icon name='trash alternate' /> Delete
        </Button>
      </Modal.Actions>
    </Modal>
  )

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <Container {...layoutProps.containerProps}>
        <Segment {...layoutProps.segmentProps}>
          <Label {...layoutProps.labelProps}>
            <Icon name='newspaper outline' /> Campaigns
          </Label>
          <ChangeList
            onInsert={handleInsert}
            onEdit={handleEdit}
            canEdit={item => item.template && !item.last_dispatch}
            description={description}
            onDelete={handleDelete}
            items={campaigns}
            isLoading={isLoading}
            listDisplay={listDisplay}
            idProp='id'
            sortField='id'
            sortDirection='desc'
            verboseName='campaign'
            verboseNamePlural='campaigns'
            searchFields={['name']}
            moreActions={item => [
              <Icon
                title='details'
                name='chart line'
                circular
                color='blue'
                onClick={() => history.push(config.urls.campaignDetail.replace(':id', item.id))}
                key='detail-btn'
                style={{
                  cursor: 'pointer'
                }}
              />,
              <Icon
                title='duplicate'
                name='copy outline'
                circular
                disabled={!item.template}
                color='blue'
                onClick={() => handleDuplicate(item)}
                key='duplicate-btn'
                style={{
                  cursor: 'pointer'
                }}
              />,
              <Icon
                title='send'
                name='send'
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
          />
          {deleteModal.open && deleteModalComponent(deleteModal.item)}
        </Segment>
      </Container>
    </BaseLayout>
  )
}

AdminSubscribersView.propTypes = {}

export default AdminSubscribersView
