import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Icon, Form, List, Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { api } from '../Sagas'
import { toast } from 'react-toastify'

const SubjectSuggestionsModal = props => {
  // translations
  const { t } = useTranslation()
  const [fields, setFields] = useState({
    topic: '',
    mean_age: ''
  })
  const [suggestions, setSuggestions] = useState([])
  const setField = fieldName => (evt) => setFields({ ...fields, [fieldName]: evt.target.value })

  const handleSubmit = async () => {
    const res = await api.suggestSubject(fields)
    if (res.status === 409) {
      toast.error(t('Service unavailable at the moment. Please try again later.'))
      return
    }
    const content = res.data.answer.content
    const items = content.split('\n').map(item => item.replace(/^[0-9]*.*"/, '').replace(/"$/, ''))
    setFields({ topic: '', mean_age: '' })
    setSuggestions(items)
  }

  const selectSuggestion = (suggestion) => () => {
    props.onSelectSuggestion(suggestion)
    props.onClose()
  }

  return (
    <Modal open size='tiny' onClose={props.onClose}>
      <Modal.Header>{t('AI subject suggestions')}</Modal.Header>
      <Modal.Content>
        <p>{t('SubjectSuggestionDescription')}</p>
        <Form>
          <Form.Field>
            <Form.Input
              label={t('Main newsletter argument')}
              placeholder={t('i.e. Use of AI in the health sector')}
              defaultValue={fields.topic}
              onChange={setField('topic')}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label={t('Audience mean age')}
              placeholder={t('i.e. 27')}
              defaultValue={fields.mean_age}
              onChange={setField('mean_age')}
              type='number'
            />
          </Form.Field>
        </Form>
        {suggestions.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <Header as='h5'>{t('Suggestions')}</Header>
            <p>{t('Click a suggestion to use it')}</p>
            <List ordered>
              {suggestions.map((s, i) => <List.Item onClick={selectSuggestion(s)} key={i}><a style={{ cursor: 'pointer' }}>{s}</a></List.Item>)}
            </List>
          </div>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' inverted onClick={props.onClose}>
          <Icon name='remove' /> {t('Cancel')}
        </Button>
        <Button
          color='green'
          inverted
          disabled={!fields.topic || !fields.mean_age}
          onClick={handleSubmit}
        >
          <Icon name='space shuttle' /> {t('Suggest')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

SubjectSuggestionsModal.defaultProps = {
}

SubjectSuggestionsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSelectSuggestion: PropTypes.func.isRequired
}

export default SubjectSuggestionsModal
