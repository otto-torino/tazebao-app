import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import BouncesActions from '../../Redux/Bounces'
import SubscribersActions from '../../Redux/Subscribers'
import { Confirm } from 'semantic-ui-react'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import { useTranslation } from 'react-i18next'
import { request } from '../../Services/Request'
import moment from 'moment'

import styles from './BouncesView.module.scss'

const BouncesView = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const bounces = useSelector(state => state.bounces.data)
  const isWholeDataSet = useSelector(state => state.bounces.isWholeDataSet)
  const querystring = useSelector(state => state.bounces.qs)
  const bouncesCount = useSelector(state => state.bounces.count)
  const isLoading = useSelector(state => state.bounces.fetching)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedBounces, setSelectedBounces] = useState([])

  const listDisplay = ['id', 'datetime', 'subscriber_email', 'message', 'campaign_name']

  const handleDelete = id => {
    return request(
      'deleteBounce',
      [id],
      t('There was an error deleting the bounce') + ': {error}',
      response => dispatch(BouncesActions.bouncesRequest())
    )
  }

  const confirmUnsubscribe = ids => {
    setSelectedBounces(ids)
    setShowConfirm(true)
  }

  const unsubscribe = () => {
    return request(
      'deleteSubscribersFromBounces',
      [selectedBounces],
      t('There was an error removing the subscribers') + ': {error}',
      response => {
        if (!isWholeDataSet) {
          handleUpdateQuerystring({ ...querystring, page: 1 }, true)
        } else {
          dispatch(BouncesActions.bouncesRequest())
        }
        dispatch(SubscribersActions.subscribersRequest())
        setShowConfirm(false)
        setSelectedBounces([])
      },
      error => {
        setShowConfirm(false)
      }
    )
  }

  const description = (
    <p>{t('Here are your bounces. The system tries to understand at which dispatch they belongs and shows the campaign name')}.</p>
  )

  const handleUpdateQuerystring = qs => {
    dispatch(BouncesActions.bouncesQuerystring(qs))
  }

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <ModelAdmin
        icon='ban'
        title='Bounces'
        toStringProp='subscriber_email'
        verboseName={t('bounce')}
        verboseNamePlural={t('bounces')}
        onInsert={null}
        onEdit={null}
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
            canInsert={false}
            onInsert={handleInsert}
            onEdit={handleEdit}
            canEdit={() => false}
            description={description}
            onDelete={handleDelete}
            hideButtonWithoutPermissions
            items={bounces}
            isLoading={isLoading}
            listDisplay={listDisplay}
            idProp={idProp}
            verboseName={verboseName}
            verboseNamePlural={verboseNamePlural}
            searchFields={['subscriber_email', 'campaign_name']}
            fieldsMapping={{
              datetime: v => moment(v).format('LLL')
            }}
            listActions={{
              deleteSubscribers: {
                label: t('Unsubscribe selected e-mails'),
                action: confirmUnsubscribe,
                options: { setPage: 1 }
              }
            }}
            isWholeDataSet={isWholeDataSet}
            querystring={querystring}
            dataSetCount={bouncesCount}
            onUpdateQuerystring={handleUpdateQuerystring}
          />
        )}
      </ModelAdmin>
      {showConfirm && (
        <Confirm
          open
          content={t('AreYouSure')}
          onCancel={() => setShowConfirm(false)}
          onConfirm={unsubscribe}
        />
      )}
    </BaseLayout>
  )
}

BouncesView.propTypes = {}

export default BouncesView
