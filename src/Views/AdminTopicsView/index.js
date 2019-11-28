import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import TopicForm from '../../Forms/TopicForm'
import TopicsActions from '../../Redux/Topics'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import { request } from '../../Services/Request'

import styles from './AdminTopicsView.module.scss'

const AdminSubscribersView = props => {
  const dispatch = useDispatch()
  const topics = useSelector(state => state.topics.data)
  const isLoading = useSelector(state => state.topics.fetching)

  const listDisplay = ['id', 'name', 'sending_address', 'sending_name', 'unsubscribe_url']

  const handleInsert = data => {
    return request(
      'addTopic',
      [data],
      'There was an error inserting the topic: {error}',
      response => dispatch(TopicsActions.topicsRequest())
    )
  }

  const handleEdit = (id, data) => {
    return request(
      'editTopic',
      [data],
      'There was an error editing the topic: {error}',
      response => dispatch(TopicsActions.topicsRequest())
    )
  }

  const handleDelete = id => {
    return request(
      'deleteTopic',
      [id],
      'There was an error deleting the topic: {error}',
      response => dispatch(TopicsActions.topicsRequest())
    )
  }

  const description = (
    <p>
      Your campaign are grouped by topics. a Topic defines the sending e-mail address and name and
      the unsubscribe url.<br />
      <strong>Pay attention</strong>: when you delete a topic, you'll also delete all related campaigns!
    </p>
  )

  const deleteModalContent = (
    <div>
      <p>Deleted items cannot be restored. <strong>Deleting a topic you'll delete also all related campaigns! Proceed?</strong></p>
    </div>
  )

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <ModelAdmin
        icon='tags'
        title='Topics'
        FormComponent={TopicForm}
        toStringProp='name'
        verboseName='topic'
        verboseNamePlural='topics'
        onInsert={handleInsert}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteModalContent={deleteModalContent}
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
            onInsert={handleInsert}
            onEdit={handleEdit}
            description={description}
            onDelete={handleDelete}
            items={Object.keys(topics).map(k => topics[k])}
            isLoading={isLoading}
            listDisplay={listDisplay}
            idProp={idProp}
            sortField='id'
            sortDirection='desc'
            verboseName={verboseName}
            verboseNamePlural={verboseNamePlural}
            searchFields={['name']}
          />
        )}
      </ModelAdmin>
    </BaseLayout>
  )
}

AdminSubscribersView.propTypes = {}

export default AdminSubscribersView
