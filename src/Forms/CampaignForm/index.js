import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Icon, Form, Message, Checkbox, Popup } from 'semantic-ui-react'
import SubjectSuggestionsModal from '../../Components/SubjectSuggestionsModal'

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
      },
      suggestionModalOpen: false
    }
  }

  // return true if finds errors, false otherwise
  // sets errors in state
  validate () {
    const { t } = this.props
    const errors = {}
    let result = true;
    ['name', 'topic', 'subject'].forEach(f => {
      if (!this.state.fields[f]) {
        errors[f] = t('this field is required')
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
    const { t } = this.props
    return (
      <div className='form-fieldset' data-tour='create-campaign-form'>
        <Form.Group widths='equal'>
          <Form.Field>
            <Form.Input
              label={t('Name')}
              placeholder={t('i.e. Newsletter n. XIX')}
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
              label={t('Topic')}
              placeholder={t('Select topic')}
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
              label={t('Subject')}
              fluid
              placeholder={t('i.e. Special offer!')}
              error={!!this.state.errors.subject}
              defaultValue={this.state.fields.subject}
              onChange={this.onChangeField('subject', 'value')}
              icon={/*<Popup content={t('AI suggestions')} trigger={<Icon name='space shuttle' inverted circular link onClick={() => this.setState({ suggestionModalOpen: true })} />} />*/undefined}
            />
            {!!this.state.errors.subject && (
              <Message attached='top'><Icon name='warning circle' /> {this.state.errors.subject}</Message>
            )}
          </Form.Field>
          <Form.Field>
            <label>View on-line</label>
            <Checkbox
              label={t('Check in order to make the newsletter available on-line at a public URL')}
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
        {this.state.suggestionModalOpen && (
          <SubjectSuggestionsModal
            onClose={() => this.setState({ suggestionModalOpen: false })}
            onSelectSuggestion={s => this.setState({ fields: { ...this.state.fields, subject: s } })}
          />
        )}
      </Form>
    )
  }
}

CampaignForm.propTypes = {
  item: PropTypes.object,
  t: PropTypes.func
}

export default withTranslation(null, { withRef: true })(CampaignForm)
