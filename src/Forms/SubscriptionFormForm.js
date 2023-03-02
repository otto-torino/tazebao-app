import React from 'react'
import PropTypes from 'prop-types'
import JoditEditor from 'jodit-react'
import { Icon, Form, Input, Message, Tab } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import MultipleChoiceField from '../Components/MultipleChoiceField'

class SubscriptionFormForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: {},
      fields: {
        id: this.props.item ? this.props.item.id : '',
        name: this.props.item ? this.props.item.name : '',
        content: this.props.item ? this.props.item.content : '',
        privacy_disclaimer: this.props.item ? this.props.item.privacy_disclaimer : '',
        success_url: this.props.item ? this.props.item.success_url : '',
        error_url: this.props.item ? this.props.item.error_url : '',
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
    ['name', 'privacy_disclaimer'].forEach(f => {
      if (!this.state.fields[f]) {
        errors[f] = t('this field is required')
        result = false
      }
    })

    if (this.state.fields.lists.length === 0) {
      errors.fields = t('this field is required')
      result = false
    }

    this.setState({ errors: errors })
    return result
  }

  // form submit
  submit () {
    this.setState({ errors: {} })
    const isValid = this.validate()
    if (isValid === true) {
      const fields = {
        ...this.state.fields,
        content: this.state.fields.content,
        privacy_disclaimer: this.state.fields.privacy_disclaimer
      }
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
    this.setState({
      fields: Object.assign({}, this.state.fields, { lists: value })
    })
  }

  listsFieldset () {
    const { t } = this.props
    return {
      menuItem: t('Lists'),
      render: () => {
        return (
          <div className='form-fieldset'>
            <MultipleChoiceField
              // eslint-disable-next-line max-len
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

  fieldset () {
    const { t } = this.props
    return {
      menuItem: t('Main'),
      render: () => {
        return (
          <div className='form-fieldset'>
            <Form.Field>
              <label>{t('Name')}</label>
              <Input
                placeholder={t('i.e. Home page form')}
                error={!!this.state.errors.name}
                defaultValue={this.state.fields.name}
                onChange={this.onChangeField('name', 'value')}
              />
              {!!this.state.errors.name && (
                <Message attached='top'><Icon name='warning circle' /> {this.state.errors.name}</Message>
              )}
            </Form.Field>
            <Form.Field>
              <label>{t('Content')}</label>
              <JoditEditor
                value={this.state.fields.content}
                tabIndex={1} // tabIndex of textarea
                onBlur={(content) =>
                  this.setState({ fields: { ...this.state.fields, content } })} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
              />
              {!!this.state.errors.content && (
                <Message attached='top'><Icon name='warning circle' /> {this.state.errors.content}</Message>
              )}
            </Form.Field>
            <Form.Field>
              <label>{t('Privacy disclaimer')}</label>
              <JoditEditor
                value={this.state.fields.privacy_disclaimer}
                tabIndex={1} // tabIndex of textarea
                onBlur={(content) =>
                  this.setState({ fields: { ...this.state.fields, privacy_disclaimer: content } })}
                onChange={(newContent) => {}}
              />
              {!!this.state.errors.privacy_disclaimer && (
                <Message attached='top'><Icon name='warning circle' /> {this.state.errors.privacy_disclaimer}</Message>
              )}
            </Form.Field>
            <Form.Field>
              <label>{t('Success URL')}</label>
              <Input
                placeholder={t('SucessUrlPlaceholder')}
                error={!!this.state.errors.success_url}
                defaultValue={this.state.fields.success_url}
                onChange={this.onChangeField('success_url', 'value')}
              />
              {!!this.state.errors.success_url && (
                <Message attached='top'><Icon name='warning circle' /> {this.state.errors.success_url}</Message>
              )}
              {!this.state.errors.success_url && (
                <div style={{ marginTop: '.5rem', fontStyle: 'italic' }}><Icon name='info circle' /> {t('SubscriptionFormSuccessUrlHelpText')}</div>
              )}
            </Form.Field>
            <Form.Field>
              <label>{t('Error URL')}</label>
              <Input
                placeholder={t('ErrorUrlPlaceholder')}
                error={!!this.state.errors.error_url}
                defaultValue={this.state.fields.error_url}
                onChange={this.onChangeField('error_url', 'value')}
              />
              {!!this.state.errors.error_url && (
                <Message attached='top'><Icon name='warning circle' /> {this.state.errors.error_url}</Message>
              )}
              {!this.state.errors.error_url && (
                <div style={{ marginTop: '.5rem', fontStyle: 'italic' }}><Icon name='info circle' /> {t('Needed when embedding the form')}</div>
              )}
            </Form.Field>
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

SubscriptionFormForm.propTypes = {
  item: PropTypes.object,
  lists: PropTypes.object,
  t: PropTypes.func
}

export default withTranslation(null, { withRef: true })(SubscriptionFormForm)
