import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Form, Message, Checkbox } from 'semantic-ui-react'

class CampaignForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: {},
      fields: {
        name: this.props.item ? this.props.item.name : '',
        topic: this.props.item ? this.props.item.topic : '',
        subject: this.props.item ? this.props.item.subject : '',
        view_online: this.props.item ? this.props.item.view_online : false
      }
    }
  }

  // return true if finds errors, false otherwise
  // sets errors in state
  validate () {
    const errors = {}
    let result = true;
    ['name', 'topic', 'subject'].forEach(f => {
      if (!this.state.fields[f]) {
        errors[f] = 'this field is required'
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
      return { id: this.props.item ? this.props.item.id : undefined, data: fields }
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
        <Form.Group widths='equal'>
          <Form.Field>
            <Form.Input
              label='Name'
              placeholder='i.e. Newsletter n. XIX'
              error={!!this.state.errors.name}
              defaultValue={this.state.fields.name}
              onChange={this.onChangeField('name', 'value')}
            />
            {!!this.state.errors.name && (
              <Message attached='top'><Icon name='warning circle' /> {this.state.errors.name}</Message>
            )}
          </Form.Field>
          <Form.Field>
            <Form.Select
              label='Topic'
              placeholder='Select topic'
              error={!!this.state.errors.topic}
              defaultValue={this.state.fields.topic}
              onChange={this.onChangeField('topic', 'value')}
              options={this.props.topics.map(t => ({ value: t.id, text: t.name }))}
            />
            {!!this.state.errors.topic && (
              <Message attached='top'><Icon name='warning circle' /> {this.state.errors.topic}</Message>
            )}
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <Form.Input
              label='Subject'
              fluid
              placeholder='i.e. Special offer!'
              error={!!this.state.errors.subject}
              defaultValue={this.state.fields.subject}
              onChange={this.onChangeField('subject', 'value')}
            />
            {!!this.state.errors.subject && (
              <Message attached='top'><Icon name='warning circle' /> {this.state.errors.subject}</Message>
            )}
          </Form.Field>
          <Form.Field>
            <label>View on-line</label>
            <Checkbox
              label='Check in order to make the newsletter available on-line at a public URL'
              onChange={this.onChangeField('view_online', 'checked')}
              checked={this.state.fields.view_online}
            />
            {!!this.state.errors.view_online && (
              <Message attached='top'><Icon name='warning circle' /> {this.state.errors.view_online}</Message>
            )}
          </Form.Field>
        </Form.Group>
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

CampaignForm.propTypes = {
  item: PropTypes.object
}

export default CampaignForm
