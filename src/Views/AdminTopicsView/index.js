import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import TopicForm from '../../Forms/TopicForm'
import TopicsActions from '../../Redux/Topics'
import { useTranslation, Trans } from 'react-i18next'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import { request } from '../../Services/Request'

import styles from './AdminTopicsView.module.scss'

const AdminSubscribersView = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const topics = useSelector(state => state.topics.data)
  const isLoading = useSelector(state => state.topics.fetching)

  const listDisplay = ['id', 'name', 'sending_address', 'sending_name', 'unsubscribe_url']

  const handleInsert = data => {
    return request(
      'addTopic',
      [data],
      t('There was an error inserting the topic') + ': {error}',
      response => dispatch(TopicsActions.topicsRequest())
    )
  }

  const handleEdit = (id, data) => {
    return request(
      'editTopic',
      [data],
      t('There was an error editing the topic') + ': {error}',
      response => dispatch(TopicsActions.topicsRequest())
    )
  }

  const handleDelete = id => {
    return request(
      'deleteTopic',
      [id],
      t('There was an error deleting the topic') + ': {error}',
      response => dispatch(TopicsActions.topicsRequest())
    )
  }

  const description = (
    <p><Trans>dmin_topic_description</Trans></p>
  )

  const deleteModalContent = (
    <div><p><Trans>topic_delete_message</Trans></p></div>
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
