import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import MailerMessagesActions from '../../Redux/MailerMessages'
import SubscribersActions from '../../Redux/Subscribers'
import { Confirm } from 'semantic-ui-react'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import { useTranslation } from 'react-i18next'
import { request } from '../../Services/Request'
import moment from 'moment'

import styles from './MailerMessagesView.module.scss'

const MailerMessagesView = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const mailerMessages = useSelector(state => state.mailerMessages.data)
  const isWholeDataSet = useSelector(state => state.mailerMessages.isWholeDataSet)
  const querystring = useSelector(state => state.mailerMessages.qs)
  const mailerMessagesCount = useSelector(state => state.mailerMessages.count)
  const isLoading = useSelector(state => state.mailerMessages.fetching)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedMailerMessages, setSelectedMailerMessages] = useState([])

  const listDisplay = ['id', 'created', 'to_address', 'from_address', 'sent', 'last_attempt']

  const handleDelete = id => {
    return request(
      'deleteMailerMessage',
      [id],
      t('There was an error deleting the log') + ': {error}',
      response => dispatch(MailerMessagesActions.mailerMessagesRequest())
    )
  }

  const confirmUnsubscribe = ids => {
    setSelectedMailerMessages(ids)
    setShowConfirm(true)
  }

  const unsubscribe = () => {
    return request(
      'deleteSubscribersFromMailerMessages',
      [selectedMailerMessages],
      t('There was an error removing the subscribers') + ': {error}',
      response => {
        if (!isWholeDataSet) {
          handleUpdateQuerystring({ ...querystring, page: 1 }, true)
        } else {
          dispatch(MailerMessagesActions.mailerMessagesRequest())
        }
        dispatch(SubscribersActions.subscribersRequest())
        setShowConfirm(false)
        setSelectedMailerMessages([])
      },
      error => {
        setShowConfirm(false)
      }
    )
  }

  const listFilters = {
    sent: {
      label: t('sent'),
      options: [
        { value: null, text: t('All'), key: 0 },
        { value: 0, text: t('No'), key: 1 },
        { value: 1, text: t('Yes'), key: 2 }
      ],
      filter: (record, value) => {
        return record.sent === !!value
      }
    }
  }

  const description = (
    <p>{t('MailerMessageAdminText')}.</p>
  )

  const handleUpdateQuerystring = qs => {
    dispatch(MailerMessagesActions.mailerMessagesQuerystring(qs))
  }

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <ModelAdmin
        icon='file text'
        title={t('Logs')}
        toStringProp='id'
        verboseName={t('log')}
        verboseNamePlural={t('logs')}
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
            items={mailerMessages}
            isLoading={isLoading}
            listDisplay={listDisplay}
            listFilters={listFilters}
            idProp={idProp}
            verboseName={verboseName}
            verboseNamePlural={verboseNamePlural}
            searchFields={['to_address']}
            fieldsMapping={{
              created: v => moment(v).format('LLL'),
              last_attempt: v => v ? moment(v).format('LLL') : ''
            }}
            listActions={{
              deleteSubscribers: {
                label: t('Unsubscribe selected to e-mails'),
                action: confirmUnsubscribe,
                options: { setPage: 1 }
              }
            }}
            isWholeDataSet={isWholeDataSet}
            querystring={querystring}
            dataSetCount={mailerMessagesCount}
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

MailerMessagesView.propTypes = {}

export default MailerMessagesView
