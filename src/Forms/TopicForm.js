import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Form, Input, Message } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'

class TopicForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: {},
      fields: {
        id: this.props.item ? this.props.item.id : '',
        name: this.props.item ? this.props.item.name : '',
        sending_address: this.props.item ? this.props.item.sending_address : '',
        sending_name: this.props.item ? this.props.item.sending_name : '',
        unsubscribe_url: this.props.item ? this.props.item.unsubscribe_url : ''
      }
    }
  }

  // return true if finds errors, false otherwise
  // sets errors in state
  validate () {
    const { t } = this.props
    const errors = {}
    let result = true;
    ['name', 'sending_address', 'sending_name', 'unsubscribe_url'].forEach(f => {
      if (!this.state.fields[f]) {
        errors[f] = t('this field is required')
        result = false
      }
      if (f === 'sending_address' && !/\S+@\S+\.\S+/.test(this.state.fields.sending_address)) {
        errors[f] = t('invalid e-mail address')
        result = false
      }
    })
    this.setState({ errors: errors })
    return result
  }

  // form submit
  submit () {
    this.setState({ errors: {} })
    const isValid = this.validate()
    if (isValid === true) {
      const fields = Object.assign({}, this.state.fields)
      return { id: this.state.fields.id, data: fields }
    }
    return false
  }

  onChangeField (fieldName, valueProp) {
    return (evt, field) => {
      this.setState({ fields: Object.assign({}, this.state.fields, { [fieldName]: field[valueProp] }) })
    }
  }

  fieldset () {
    const { t } = this.props
    return (
      <div className='form-fieldset'>
        <Form.Field>
          <label>{t('Name')}</label>
          <Input
            placeholder={t('i.e. Promotions')}
            error={!!this.state.errors.name}
            defaultValue={this.state.fields.name}
            onChange={this.onChangeField('name', 'value')}
          />
          {!!this.state.errors.name && (
            <Message attached='top'><Icon name='warning circle' /> {this.state.errors.name}</Message>
          )}
        </Form.Field>
        <Form.Field>
          <label>{t('Sending address')}</label>
          <Input
            placeholder={t('i.e. newsletter@example.com')}
            error={!!this.state.errors.sending_address}
            defaultValue={this.state.fields.sending_address}
            onChange={this.onChangeField('sending_address', 'value')}
          />
          {!!this.state.errors.sending_address && (
            <Message attached='top'><Icon name='warning circle' /> {this.state.errors.sending_address}</Message>
          )}
        </Form.Field>
        <Form.Field>
          <label>{t('Sending name')}</label>
          <Input
            placeholder={t('i.e. Newsletter')}
            error={!!this.state.errors.sending_name}
            defaultValue={this.state.fields.sending_name}
            onChange={this.onChangeField('sending_name', 'value')}
          />
          {!!this.state.errors.sending_name && (
            <Message attached='top'><Icon name='warning circle' /> {this.state.errors.sending_name}</Message>
          )}
        </Form.Field>
        <Form.Field>
          <label>{t('Unsubscribe URL')}</label>
          <Input
            placeholder={t('i.e. ') + 'http://www.example.com/unsubscribe/?s={% encrypt id email %}&id={{ id }}&email={{ email }}'}
            error={!!this.state.errors.unsubscribe_url}
            defaultValue={this.state.fields.unsubscribe_url}
            onChange={this.onChangeField('unsubscribe_url', 'value')}
          />
          {!!this.state.errors.unsubscribe_url && (
            <Message attached='top'><Icon name='warning circle' /> {this.state.errors.unsubscribe_url}</Message>
          )}
          <Message info size='mini'>
            <p>{t('You can use the following variables and tags')}:</p>
            <ul>
              <li><strong>{'{{ id }}'}</strong>: {t('subscriber\'s id')}</li>
              <li><strong>{'{{ email }}'}</strong>: {t('subscriber\'s e-mail')}</li>
              <li><strong>{'{{ subscription_datetime }}'}</strong>: {t('subscribtion datetime')}</li>
            </ul>
            <p>{t('You can encrypt variables with your private SECRET KEY')}:</p>
            <code><strong>{'{% encrypt id email %}'}</strong></code>
            <p>{t('will generate an encrypted string of the concatenation of the subscriber id and e-mail')}</p>
            <p>{t('tazebao_unsubscribe_topic_helptext')}</p>
            <p><code>{'https://www.tazebao.email/newsletter/unsubscribe/?id={{ id }}&email={{ email }}&sig={% encrypt id email %}'}</code></p>
          </Message>
        </Form.Field>
      </div>
    )
  }

  render () {
    return (
      <Form>
        {this.fieldset()}
      </Form>
    )
  }
}

TopicForm.propTypes = {
  item: PropTypes.object
}

export default withTranslation(null, { withRef: true })(TopicForm)
