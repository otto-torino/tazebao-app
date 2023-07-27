import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Modal, Button, Icon, Form, Header, Divider } from 'semantic-ui-react'

import SystemMessagesActions from '../Redux/SystemMessages'
import { api } from '../Sagas'

const SystemMessagesModal = (props) => {
  // translations
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleReadMessage = (message) => async () => {
    const res = await api.systemMessageMarkAsRead(message.id)
    dispatch(SystemMessagesActions.systemMessagesRequest())
  }

  return (
    <Modal open size="large" onClose={props.onClose}>
      <Modal.Header>{t('Messages')}</Modal.Header>
      <Modal.Content>
        {props.messages.map((message, index) => (
          <div key={index}>
            <Header as="h3">
              {message.title}
              <Header.Subheader>{moment(message.datetime).format('LLL')}</Header.Subheader>
            </Header>
            <div dangerouslySetInnerHTML={{ __html: message.html }} />
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="red" inverted onClick={handleReadMessage(message)}>
                <Icon name="check" /> {t('Mark as read')}
              </Button>
            </div>
            <Divider />
          </div>
        ))}
        {props.messages.length === 0 && (
          <div style={{ textAlign: 'center' }}>
            <Icon name="check" size="huge" color="green" />
            <Header as="h3" style={{ marginTop: '1rem' }}>
              {t('All clear!')}
            </Header>
          </div>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" inverted onClick={props.onClose}>
          <Icon name="remove" /> {t('Close')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

SystemMessagesModal.defaultProps = {}

SystemMessagesModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  messages: PropTypes.array,
}

export default SystemMessagesModal
