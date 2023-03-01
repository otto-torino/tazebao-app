import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, convertFromHTML, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
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
        title: this.props.item ? this.props.item.title : '',
        content: this.props.item
          ? EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.item.content)))
          : EditorState.createEmpty(),
        privacy_disclaimer: this.props.item
          // eslint-disable-next-line max-len
          ? EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(this.props.item.privacy_disclaimer)))
          : EditorState.createEmpty(),
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

    const rawContent = convertToRaw(this.state.fields.privacy_disclaimer.getCurrentContent())
    if (rawContent.blocks.length === 1 && rawContent.blocks[0].text === '') {
      errors.privacy_disclaimer = t('this field is required')
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
        content: draftToHtml(convertToRaw(this.state.fields.content.getCurrentContent())),
        privacy_disclaimer: draftToHtml(convertToRaw(this.state.fields.privacy_disclaimer.getCurrentContent()))
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
              <label>{t('Title')}</label>
              <Input
                placeholder={t('i.e. Subscribe to our site')}
                error={!!this.state.errors.title}
                defaultValue={this.state.fields.title}
                onChange={this.onChangeField('title', 'value')}
              />
              {!!this.state.errors.title && (
                <Message attached='top'><Icon name='warning circle' /> {this.state.errors.title}</Message>
              )}
            </Form.Field>
            <Form.Field>
              <label>{t('Content')}</label>
              <Editor
                editorState={this.state.fields.content}
                wrapperClassName='wysiwyg-wrapper'
                editorClassName='wysiwyg-editor'
                onEditorStateChange={(content) => this.setState({ fields: { ...this.state.fields, content } })}
              />
              {!!this.state.errors.content && (
                <Message attached='top'><Icon name='warning circle' /> {this.state.errors.content}</Message>
              )}
            </Form.Field>
            <Form.Field>
              <label>{t('Privacy disclaimer')}</label>
              <Editor
                editorState={this.state.fields.privacy_disclaimer}
                wrapperClassName='wysiwyg-wrapper'
                editorClassName='wysiwyg-editor'
                onEditorStateChange={
                  // eslint-disable-next-line camelcase
                  (privacy_disclaimer) => this.setState({ fields: { ...this.state.fields, privacy_disclaimer } })
                }
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
                <div style={{ marginTop: '.5rem', fontStyle: 'italic' }}><Icon name='info circle' /> {t('Needed when embedding the form')}</div>
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
  lists: PropTypes.object
}

export default withTranslation(null, { withRef: true })(SubscriptionFormForm)
