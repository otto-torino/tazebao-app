import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import PropTypes from 'prop-types'
import BaseLayout from '../../Layouts/BaseLayout'
import SubscriberForm from '../../Forms/SubscriberForm'
import ChooseListsModal from '../../Components/ChooseListsModal'
import ImportCsvModalForm from '../../Components/ImportCsvModalForm'
import SubscribersActions from '../../Redux/Subscribers'
import ListActions from '../../Redux/Lists'
import { toast } from 'react-toastify'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import {
  Icon,
  Button,
  Modal
} from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'
import { request } from '../../Services/Request'
import moment from 'moment'

import styles from './AdminSubscribersView.module.scss'

const AdminSubscribersView = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [chooseListModalData, setChooseListModalData] = useState({
    open: false,
    cb: null
  })
  const [deleteModalData, setDeleteModalData] = useState({
    open: false,
    cb: null
  })
  const [showSpinner, setShowSpinner] = useState(false)
  const subscribers = useSelector(state => state.subscribers.data)
  const isWholeDataSet = useSelector(state => state.subscribers.isWholeDataSet)
  const querystring = useSelector(state => state.subscribers.qs)
  const subscribersCount = useSelector(state => state.subscribers.count)
  const lists = useSelector(state => state.lists.data)
  const isLoading = useSelector(state => state.subscribers.fetching)
  const [importCsvModalIsOpen, setImportCsvModalIsOpen] = useState(false)

  const listDisplay = ['id', 'email', 'subscription_datetime', 'lists', 'info']
  const listActions = {
    delete: {
      label: t('Delete selected subscribers'),
      action: ids => {
        setDeleteModalData({ open: true, cb: () => handleDeleteSelected(ids) })
      },
      options: { setPage: 1 }
    },
    addToList: {
      label: t('Add selected items to lists'),
      action: ids => {
        setChooseListModalData({ open: true, cb: handleAddLists(ids) })
      }
    },
    removeFromList: {
      label: t('Remove selected items from lists'),
      action: ids => {
        setChooseListModalData({ open: true, cb: handleRemoveLists(ids) })
      }
    }
  }
  const listFilters = Object.keys(lists).length
    ? {
      lists: {
        label: t('list'),
        options: [
          { value: null, text: t('All lists'), key: 0 },
          ...Object.keys(lists).map(id => ({
            value: id,
            text: lists[id].name,
            key: id
          }))
        ],
        filter: (record, value) => {
          return record.lists.indexOf(parseInt(value)) !== -1
        }
      }
    }
    : {}
  const fieldsMapping = {
    subscription_datetime: dt => moment(dt).format('LLL'),
    info: value => {
      try {
        const obj = JSON.parse(value)
        return (
          <ul>
            {Object.keys(obj)
              .filter(k => obj[k])
              .map(k => (
                <li key={k}>
                  <strong>{k}</strong>: {obj[k]}
                </li>
              ))}
          </ul>
        )
      } catch {
        return value
      }
    },
    lists: value => {
      return (
        <ul>
          {value.map(lid => (
            <li key={lid}>{lists[lid].name}</li>
          ))}
        </ul>
      )
    }
  }

  const handleInsert = data => {
    return request(
      'addSubscriber',
      [data],
      t('There was an error inserting the subscriber') + ': {error}',
      response => dispatch(SubscribersActions.subscribersRequest())
    )
  }

  const handleEdit = (id, data) => {
    return request(
      'editSubscriber',
      [data],
      t('There was an error editing the subscriber') + ': {error}',
      response => dispatch(SubscribersActions.subscribersRequest())
    )
  }

  const handleDelete = id => {
    return request(
      'deleteSubscriber',
      [id],
      t('There was an error deleting the subscriber') + ': {error}',
      response => dispatch(SubscribersActions.subscribersRequest())
    )
  }

  const handleDeleteSelected = ids => {
    return request(
      'deleteSubscribers',
      [ids],
      t('There was an error deleting the subscribers') + ': {error}',
      response => {
        if (!isWholeDataSet) {
          handleUpdateQuerystring({ ...querystring, page: 1 }, true)
        } else {
          dispatch(SubscribersActions.subscribersRequest())
        }
        setDeleteModalData({ open: false, cb: null })
        dispatch(ListActions.listsRequest())
      }
    )
  }

  const handleAddLists = ids => selectedLists => {
    request(
      'subscribersAddLists',
      [ids, selectedLists],
      t('There was an error adding the selected lists'),
      response => {
        dispatch(SubscribersActions.subscribersRequest())
        setChooseListModalData({ open: false, cb: null })
        dispatch(ListActions.listsRequest())
      },
      error => setChooseListModalData({ open: false, cb: null })
    )
  }

  const handleRemoveLists = ids => selectedLists => {
    request(
      'subscribersRemoveLists',
      [ids, selectedLists],
      t('There was an error removing the selected lists'),
      response => {
        dispatch(SubscribersActions.subscribersRequest())
        setChooseListModalData({ open: false, cb: null })
        dispatch(ListActions.listsRequest())
      },
      error => setChooseListModalData({ open: false, cb: null })
    )
  }

  const handleImport = (file, lists) => {
    // set spinner before request
    setShowSpinner(true)
    const formData = new FormData()
    formData.append('lists', lists)
    formData.append('file', file)
    request(
      'importSubscribers',
      [formData],
      'There was an error importing the file: {error}',
      response => {
        dispatch(SubscribersActions.subscribersRequest())
        dispatch(ListActions.listsRequest())
        setShowSpinner(false)
        setImportCsvModalIsOpen(false)
        toast(t('Import succeded'), { type: 'success' })
      },
      error => setShowSpinner(false)
    )
  }

  const handleUpdateQuerystring = qs => {
    dispatch(SubscribersActions.subscribersQuerystring(qs))
  }

  const description = (
    <p dangerouslySetInnerHTML={{ __html: t('admin_subscribers_description') }} />
  )

  const toolbarButtons = (
    <Button
      color='blue'
      onClick={() => setImportCsvModalIsOpen(true)}
      icon
      data-tour='changelist-import'
      style={{ marginBottom: '1rem' }}
    >
      <Icon name='file excel outline' /> {t('Import from CSV file')}
    </Button>
  )

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <ModelAdmin
        icon='user'
        title={t('Subscribers')}
        FormComponent={SubscriberForm}
        formProps={{ lists }}
        toStringProp='email'
        verboseName={t('subscriber')}
        verboseNamePlural={t('subscribers')}
        onInsert={handleInsert}
        onEdit={handleEdit}
        onDelete={handleDelete}
        idProp='id'
      >
        {({
          handleInsert,
          handleEdit,
          handleDelete,
          idProp,
          verboseName,
          verboseNamePlural
        }) => (
          <ChangeList
            description={description}
            onInsert={handleInsert}
            onEdit={handleEdit}
            onDelete={handleDelete}
            toolbarButtons={toolbarButtons}
            items={subscribers}
            isLoading={isLoading}
            listDisplay={listDisplay}
            listActions={listActions}
            idProp='id'
            sortableFields={['id', 'email', 'subscription_datetime']}
            verboseName={verboseName}
            verboseNamePlural={verboseNamePlural}
            listFilters={listFilters}
            searchFields={['email', 'info']}
            fieldsMapping={fieldsMapping}
            isWholeDataSet={isWholeDataSet}
            dataSetCount={subscribersCount}
            onUpdateQuerystring={handleUpdateQuerystring}
            querystring={querystring}
          />
        )}
      </ModelAdmin>
      {chooseListModalData.open && (
        <ChooseListsModal
          onClose={() => setChooseListModalData({...chooseListModalData, open: false, cb: null})}
          onSubmit={lists => chooseListModalData.cb(lists)}
        />
      )}
      {importCsvModalIsOpen && (
        <ImportCsvModalForm
          onClose={() => setImportCsvModalIsOpen(false)}
          onImport={handleImport}
          loading={showSpinner}
        />
      )}
      {deleteModalData.open && (
        <Modal open size='small' onClose={() => setDeleteModalData({ open: false })}>
          <Modal.Header>{t('Delete selected subscribers')}</Modal.Header>
          <Modal.Content><Trans>Deleted items cannot be restored. Proceed?</Trans></Modal.Content>
          <Modal.Actions>
            <Button color='red' inverted onClick={() => setDeleteModalData({ open: false })}>
              <Icon name='remove' /> {t('Cancel')}
            </Button>
            <Button color='green' inverted onClick={deleteModalData.cb}>
              <Icon name='trash alternate' /> {t('Delete')}
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </BaseLayout>
  )
}

AdminSubscribersView.propTypes = {}

export default AdminSubscribersView
