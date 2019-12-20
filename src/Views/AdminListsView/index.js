import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import ListForm from '../../Forms/ListForm'
import ListsActions from '../../Redux/Lists'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import { useTranslation } from 'react-i18next'
import { request } from '../../Services/Request'

import styles from './AdminListsView.module.scss'

const AdminListsView = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lists = useSelector(state => state.lists.data)
  const isLoading = useSelector(state => state.lists.fetching)

  const listDisplay = ['id', 'name', 'tot_subscribers']

  const handleInsert = data => {
    return request(
      'addList',
      [data],
      t('There was an error inserting the list') + ': {error}',
      response => dispatch(ListsActions.listsRequest())
    )
  }

  const handleEdit = (id, data) => {
    return request(
      'editList',
      [data],
      t('There was an error editing the list') + ': {error}',
      response => dispatch(ListsActions.listsRequest())
    )
  }

  const handleDelete = id => {
    return request(
      'deleteList',
      [id],
      t('There was an error deleting the list') + ': {error}',
      response => dispatch(ListsActions.listsRequest())
    )
  }

  const description = (
    <p>{t('admin_lists_description')}</p>
  )

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <ModelAdmin
        icon='users'
        title={t('Lists')}
        FormComponent={ListForm}
        toStringProp='name'
        verboseName={t('list')}
        verboseNamePlural={t('lists')}
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
            onInsert={handleInsert}
            onEdit={handleEdit}
            description={description}
            onDelete={handleDelete}
            items={Object.keys(lists).map(k => lists[k])}
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

AdminListsView.propTypes = {}

export default AdminListsView
