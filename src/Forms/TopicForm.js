import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Form, Input, Message } from 'semantic-ui-react'

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
    const errors = {}
    let result = true;
    ['name', 'sending_address', 'sending_name', 'unsubscribe_url'].forEach(f => {
      if (!this.state.fields[f]) {
        errors[f] = 'this field is required'
        result = false
      }
      if (f === 'sending_address' && !/\S+@\S+\.\S+/.test(this.state.fields.sending_address)) {
        errors[f] = 'invalid e-mail address'
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
    return (
      <div className='form-fieldset'>
        <Form.Field>
          <label>Name</label>
          <Input
            placeholder='i.e. Promotions'
            error={!!this.state.errors.name}
            defaultValue={this.state.fields.name}
            onChange={this.onChangeField('name', 'value')}
          />
          {!!this.state.errors.name && (
            <Message attached='top'><Icon name='warning circle' /> {this.state.errors.name}</Message>
          )}
        </Form.Field>
        <Form.Field>
          <label>Sending address</label>
          <Input
            placeholder='i.e. newsletter@example.com'
            error={!!this.state.errors.sending_address}
            defaultValue={this.state.fields.sending_address}
            onChange={this.onChangeField('sending_address', 'value')}
          />
          {!!this.state.errors.sending_address && (
            <Message attached='top'><Icon name='warning circle' /> {this.state.errors.sending_address}</Message>
          )}
        </Form.Field>
        <Form.Field>
          <label>Sending name</label>
          <Input
            placeholder='i.e. Newsletter'
            error={!!this.state.errors.sending_name}
            defaultValue={this.state.fields.sending_name}
            onChange={this.onChangeField('sending_name', 'value')}
          />
          {!!this.state.errors.sending_name && (
            <Message attached='top'><Icon name='warning circle' /> {this.state.errors.sending_name}</Message>
          )}
        </Form.Field>
        <Form.Field>
          <label>Unsubscribe URL</label>
          <Input
            placeholder='i.e. http://www.example.com/unsubscribe/?s={% encrypt id email %}&id={{ id }}&email={{ email }}'
            error={!!this.state.errors.unsubscribe_url}
            defaultValue={this.state.fields.unsubscribe_url}
            onChange={this.onChangeField('unsubscribe_url', 'value')}
          />
          {!!this.state.errors.unsubscribe_url && (
            <Message attached='top'><Icon name='warning circle' /> {this.state.errors.unsubscribe_url}</Message>
          )}
          <Message info size='mini'>
            <p>You can use the following variables and tags:</p>
            <ul>
              <li><strong>{'{{ id }}'}</strong>: subscriber's id</li>
              <li><strong>{'{{ email }}'}</strong>: subscriber's e-mail</li>
              <li><strong>{'{{ subscription_datetime }}'}</strong>: subscribtion datetime</li>
            </ul>
            <p>You can encrypt variables with your private SECRET KEY:</p>
            <code><strong>{'{% encrypt id email %}'}</strong></code>
            <p>will generate an encrypted string of the concatenation of the subscriber id and e-mail</p>
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

export default TopicForm
