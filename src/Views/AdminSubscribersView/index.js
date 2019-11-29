import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import BaseLayout from '../../Layouts/BaseLayout'
import SubscriberForm from '../../Forms/SubscriberForm'
import ChooseListsModal from '../../Components/ChooseListsModal'
import SubscribersActions from '../../Redux/Subscribers'
import ListActions from '../../Redux/Lists'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import { request } from '../../Services/Request'
import moment from 'moment'

import styles from './AdminSubscribersView.module.scss'

const AdminSubscribersView = props => {
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
    logSelected: {
      label: 'Log selected',
      action: ids => {
        dispatch(SubscribersActions.subscribersRequest())
      }
    },
    addToList: {
      label: 'Add selected items to lists',
      action: ids => {
        setChooseListModalData({ open: true, cb: handleAddLists(ids) })
        dispatch(ListActions.listsRequest())
      }
    },
    removeFromList: {
      label: 'Remove selected items from lists',
      action: ids => {
        setChooseListModalData({ open: true, cb: handleRemoveLists(ids) })
        dispatch(ListActions.listsRequest())
      }
    }
  }
  const listFilters = Object.keys(lists).length
    ? {
      lists: {
        label: 'List',
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
      'There was an error inserting the subscriber: {error}',
      response => dispatch(SubscribersActions.subscribersRequest())
    )
  }

  const handleEdit = (id, data) => {
    return request(
      'editSubscriber',
      [data],
      'There was an error editing the subscriber: {error}',
      response => dispatch(SubscribersActions.subscribersRequest())
    )
  }

  const handleDelete = id => {
    return request(
      'deleteSubscriber',
      [id],
      'There was an error deleting the subscriber: {error}',
      response => dispatch(SubscribersActions.subscribersRequest())
    )
  }

  const handleAddLists = ids => selectedLists => {
    request(
      'subscribersAddLists',
      [ids, selectedLists],
      'There was an error adding the selected lists',
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
      'There was an error removing the selected lists',
      response => {
        dispatch(SubscribersActions.subscribersRequest())
        setChooseListModalData({ open: false, cb: null })
      },
      error => setChooseListModalData({ open: false, cb: null })
    )
  }

  const description = (
    <p>
      Manage all your subscribers, insert, edit, delete, add to and remove from lists.
      The <code>info</code> field should be a json field, you can use
      this <a href='https://jsonformatter.curiousconcept.com/' target='_blank'>online tool</a> to
      validate it.
    </p>
  )

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <ModelAdmin
        icon='user'
        title='Subscribers'
        FormComponent={SubscriberForm}
        formProps={{ lists }}
        toStringProp='email'
        verboseName='subscriber'
        verboseNamePlural='subscribers'
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
