import React from 'react'
import PropTypes from 'prop-types'
import { Tab, Icon, Form, Input, Message, Select } from 'semantic-ui-react'
import Datetime from 'react-datetime'
import MultipleChoiceField from '../Components/MultipleChoiceField'
import moment from 'moment'

class PlanningForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: {},
      fields: {
        id: this.props.item ? this.props.item.id : '',
        campaign: this.props.item ? this.props.item.campaign : null,
        lists: this.props.item ? this.props.item.lists : [],
        schedule: this.props.item ? this.props.item.schedule : ''
      }
    }
    this.handleListsField = this.handleListsField.bind(this)
    this.handleDatetimeScheduling = this.handleDatetimeScheduling.bind(this)
  }

  // return true if finds errors, false otherwise
  // sets errors in state
  validate () {
    const errors = {}
    let result = true;
    ['lists', 'campaign', 'schedule'].forEach(f => {
      if (!this.state.fields[f]) {
        errors[f] = 'this field is required'
        result = false
      }
      if (f === 'lists' && this.state.fields.lists.length === 0) {
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
    console.log('DIOFFA', isValid)
    if (isValid === true) {
      const fields = Object.assign({}, this.state.fields)
      return { id: this.state.fields.id, data: fields }
    }
    return false
  }

  onChangeField (fieldName, valueProp) {
    return (evt, field) => {
      this.setState({
        fields: Object.assign({}, this.state.fields, {
          [fieldName]: field[valueProp]
        })
      })
    }
  }

  handleListsField (value) {
    this.setState({
      fields: Object.assign({}, this.state.fields, { lists: value })
    })
  }

  handleDatetimeScheduling (dt) {
    this.setState({
      fields: Object.assign({}, this.state.fields, { schedule: dt })
    })
  }

  fieldset () {
    return {
      menuItem: 'Main',
      render: () => {
        return (
          <div className='form-fieldset'>
            <Form.Field>
              <label>Campaign</label>
              <Select
                placeholder='Campaign'
                error={!!this.state.errors.campaign}
                defaultValue={this.state.fields.campaign}
                onChange={this.onChangeField('campaign', 'value')}
                options={this.props.campaigns.map(c => ({
                  value: c.id,
                  text: c.name
                }))}
              />
              {!!this.state.errors.campaign && (
                <Message attached='top'>
                  <Icon name='warning circle' /> {this.state.errors.campaign}
                </Message>
              )}
            </Form.Field>
            <Form.Field>
              <label>Date&Time</label>

              <div
                style={{
                  display: 'inline-block',
                  maxWidth: '100%',
                  width: '100%'
                }}
              >
                <Datetime
                  open
                  input={false}
                  onChange={this.handleDatetimeScheduling}
                  defaultValue={moment(this.state.fields.schedule)}
                />
              </div>
              {!!this.state.errors.schedule && (
                <Message attached='top'>
                  <Icon name='warning circle' /> {this.state.errors.schedule}
                </Message>
              )}
            </Form.Field>
          </div>
        )
      }
    }
  }

  listsFieldset () {
    return {
      menuItem: 'Lists',
      render: () => {
        return (
          <div className='form-fieldset'>
            <MultipleChoiceField
              items={Object.keys(this.props.lists).map(id => ({ value: this.props.lists[id].id, label: this.props.lists[id].name }))}
              value={this.state.fields.lists}
              onChange={this.handleListsField}
            />
            {!!this.state.errors.lists && (
              <Message attached='top'>
                <Icon name='warning circle' /> {this.state.errors.lists}
              </Message>
            )}
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

PlanningForm.propTypes = {
  item: PropTypes.object,
  lists: PropTypes.object,
  campaigns: PropTypes.array
}

export default PlanningForm
