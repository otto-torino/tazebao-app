import React from 'react'
// import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import SubscriptionFormForm from '../../Forms/SubscriptionFormForm'
import SubscriptionFormsActions from '../../Redux/SubscriptionForms'
import { useTranslation, Trans } from 'react-i18next'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import { request } from '../../Services/Request'

import styles from './SubscriptionFormsView.module.scss'

const SubscriptionFormsView = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const subscriptionForms = useSelector(state => state.subscriptionForms.data)
  const isWholeDataSet = useSelector(state => state.subscriptionForms.isWholeDataSet)
  const querystring = useSelector(state => state.subscriptionForms.qs)
  const subscriptionFormsCount = useSelector(state => state.subscriptionForms.count)
  const isLoading = useSelector(state => state.subscriptionForms.fetching)

  const listDisplay = ['id', 'name']

  const handleInsert = data => {
    return request(
      'addSubscriptionForm',
      [data],
      t('There was an error inserting the subscription form') + ': {error}',
      response => dispatch(SubscriptionFormsActions.subscriptionFormsRequest())
    )
  }

  const handleEdit = (id, data) => {
    return request(
      'editSubscriptionForm',
      [data],
      t('There was an error editing the subscription form') + ': {error}',
      response => dispatch(SubscriptionFormsActions.subscriptionFormsRequest())
    )
  }

  const handleDelete = id => {
    return request(
      'deleteSubscriptionForm',
      [id],
      t('There was an error deleting the subscription form') + ': {error}',
      response => dispatch(SubscriptionFormsActions.subscriptionFormsRequest())
    )
  }

  const description = (
    <p><Trans>subscription_forms_description</Trans></p>
  )

  const deleteModalContent = (
    <div><p><Trans>subscription_form_delete_message</Trans></p></div>
  )

  const handleUpdateQuerystring = qs => {
    dispatch(SubscriptionFormsActions.subscriptionFormsQuerystring(qs))
  }

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <ModelAdmin
        icon='wpforms'
        title={t('Subscription forms')}
        FormComponent={SubscriptionFormForm}
        toStringProp='name'
        verboseName={t('subscription form')}
        verboseNamePlural={t('subscription forms')}
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
            items={Object.keys(subscriptionForms).map(k => subscriptionForms[k])}
            isLoading={isLoading}
            listDisplay={listDisplay}
            idProp={idProp}
            verboseName={verboseName}
            verboseNamePlural={verboseNamePlural}
            searchFields={['name']}
            forceJsSorting
            isWholeDataSet={isWholeDataSet}
            querystring={querystring}
            dataSetCount={subscriptionFormsCount}
            onUpdateQuerystring={handleUpdateQuerystring}
          />
        )}
      </ModelAdmin>
    </BaseLayout>
  )
}

SubscriptionFormsView.propTypes = {}

export default SubscriptionFormsView
