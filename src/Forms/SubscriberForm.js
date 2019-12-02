import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Form, Tab, Input, Message } from 'semantic-ui-react'
import MultipleChoiceField from '../Components/MultipleChoiceField'
import { withTranslation } from 'react-i18next'

class SubscriberForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: {},
      fields: {
        id: this.props.item ? this.props.item.id : '',
        email: this.props.item ? this.props.item.email : '',
        info: this.props.item ? this.props.item.info : '',
        lists: this.props.item ? this.props.item.lists : []
      }
    }
    this.handleListsField = this.handleListsField.bind(this)
  }

  // return true if finds errors, false otherwise
  // sets errors in state
  validate () {
    const { t } = this.props
    const errors = {}
    let result = true;
    ['email'].forEach(f => {
      if (!this.state.fields[f]) {
        errors[f] = t('this field is required')
        result = false
      }
    })
    if (this.state.fields.info) {
      try {
        JSON.parse(this.state.fields.info)
      } catch {
        errors.info = t('this field should contain a valid json string')
        result = false
      }
    }
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

  handleListsField (value) {
    this.setState({ fields: Object.assign({}, this.state.fields, { lists: value }) })
  }

  fieldset () {
    const { t } = this.props
    return {
      menuItem: t('Profile'),
      render: () => {
        return (
          <div className='form-fieldset'>
            <Form.Field>
              <label>E-mail</label>
              <Input
                placeholder={t('E-mail')}
                error={!!this.state.errors.email}
                defaultValue={this.state.fields.email}
                onChange={this.onChangeField('email', 'value')}
              />
              {!!this.state.errors.email && (
                <Message attached='top'><Icon name='warning circle' /> {this.state.errors.email}</Message>
              )}
            </Form.Field>
            <Form.Field>
              <label>Info</label>
              <Input
                placeholder={t('Info')}
                error={!!this.state.errors.info}
                defaultValue={this.state.fields.info}
                onChange={this.onChangeField('info', 'value')}
              />
              {!!this.state.errors.info && (
                <Message attached='top'><Icon name='warning circle' /> {this.state.errors.info}</Message>
              )}
            </Form.Field>
          </div>
        )
      }
    }
  }

  listsFieldset () {
    const { t } = this.props
    return {
      menuItem: t('Lists'),
      render: () => {
        return (
          <div className='form-fieldset'>
            <MultipleChoiceField
              items={Object.keys(this.props.lists).map(id => ({ value: this.props.lists[id].id, label: this.props.lists[id].name }))}
              value={this.state.fields.lists}
              onChange={this.handleListsField}
            />
          </div>
        )
      }
    }
  }

  render () {
    const panes = [this.fieldset(), this.listsFieldset()]
    return (
      <Form>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Form>
    )
  }
}

SubscriberForm.propTypes = {
  item: PropTypes.object,
  lists: PropTypes.object,
  t: PropTypes.func
}

export default withTranslation(null, { withRef: true })(SubscriberForm)

