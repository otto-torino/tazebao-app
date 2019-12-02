import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import BaseLayout from '../../Layouts/BaseLayout'
import SubscriberForm from '../../Forms/SubscriberForm'
import ChooseListsModal from '../../Components/ChooseListsModal'
import SubscribersActions from '../../Redux/Subscribers'
import ListActions from '../../Redux/Lists'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import { useTranslation } from 'react-i18next'
import { request } from '../../Services/Request'
import moment from 'moment'

import styles from './AdminSubscribersView.module.scss'

const AdminSubscribersView = props => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const [chooseListModalData, setChooseListModalData] = useState({
    open: false,
    cb: null
  })
  const subscribers = useSelector(state => state.subscribers.data)
  const lists = useSelector(state => state.lists.data)
  const isLoading = useSelector(state => state.subscribers.fetching)

  const listDisplay = ['id', 'email', 'subscription_datetime', 'lists', 'info']
  const listActions = {
    addToList: {
      label: t('Add selected items to lists'),
      action: ids => {
        setChooseListModalData({ open: true, cb: handleAddLists(ids) })
        dispatch(ListActions.listsRequest())
      }
    },
    removeFromList: {
      label: t('Remove selected items from lists'),
      action: ids => {
        setChooseListModalData({ open: true, cb: handleRemoveLists(ids) })
        dispatch(ListActions.listsRequest())
      }
    }
  }
  const listFilters = Object.keys(lists).length
    ? {
      lists: {
        label: t('List'),
        options: [
          { value: null, text: 'All lists', key: 0 },
          ...Object.keys(lists).map(id => ({
            value: id,
            text: lists[id].name,
            key: id
          }))
        ],
        filter: (field, value) => {
          return field.lists.indexOf(parseInt(value)) !== -1
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

  const handleAddLists = ids => selectedLists => {
    request(
      'subscribersAddLists',
      [ids, selectedLists],
      t('There was an error adding the selected lists'),
      response => {
        dispatch(SubscribersActions.subscribersRequest())
        setChooseListModalData({ open: false, cb: null })
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
      },
      error => setChooseListModalData({ open: false, cb: null })
    )
  }

  const description = (
    <p dangerouslySetInnerHTML={{ __html: t('admin_subscribers_description') }}></p>
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
            items={subscribers}
            isLoading={isLoading}
            listDisplay={listDisplay}
            listActions={listActions}
            idProp='id'
            sortField='id'
            sortDirection='desc'
            verboseName={verboseName}
            verboseNamePlural={verboseNamePlural}
            listFilters={listFilters}
            searchFields={['email', 'info']}
            fieldsMapping={fieldsMapping}
          />
        )}
      </ModelAdmin>
      {chooseListModalData.open && (
        <ChooseListsModal
          onClose={() => setChooseListModalData({...chooseListModalData, open: false, cb: null})}
          onSubmit={lists => chooseListModalData.cb(lists)}
        />
      )}
    </BaseLayout>
  )
}

AdminSubscribersView.propTypes = {}

export default AdminSubscribersView
