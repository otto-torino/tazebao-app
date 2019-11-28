import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Form, Input, Message } from 'semantic-ui-react'

class ListsForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: {},
      fields: {
        id: this.props.item ? this.props.item.id : '',
        name: this.props.item ? this.props.item.name : ''
      }
    }
  }

  // return true if finds errors, false otherwise
  // sets errors in state
  validate () {
    const errors = {}
    let result = true;
    ['name'].forEach(f => {
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
            placeholder='Name'
            error={!!this.state.errors.name}
            defaultValue={this.state.fields.name}
            onChange={this.onChangeField('name', 'value')}
          />
          {!!this.state.errors.name && (
            <Message attached='top'><Icon name='warning circle' /> {this.state.errors.name}</Message>
          )}
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

ListsForm.propTypes = {
  item: PropTypes.object,
  lists: PropTypes.object
}

export default ListsForm
