import React from 'react'
import PropTypes from 'prop-types'
// import history from '../../history'
import ChangeList from '../ChangeList'
import { Header, Segment, Container, Label, Icon, Modal, Button } from 'semantic-ui-react'

/**
 * Every web app deserves a login page :)
 *
 * Authenticated users are redirected to the home page.
 */
class ModelAdmin extends React.Component {
  constructor () {
    super()
    this.state = {
      deleteItem: null,
      editItem: null,
      insertItem: false,
      error: false
    }
    this.closeDeleteModal = this.closeDeleteModal.bind(this)
    this.closeEditModal = this.closeEditModal.bind(this)
    this.closeInsertModal = this.closeInsertModal.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onDeleteSubmit = this.onDeleteSubmit.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onEditSubmit = this.onEditSubmit.bind(this)
    this.onInsert = this.onInsert.bind(this)
    this.onInsertSubmit = this.onInsertSubmit.bind(this)
  }

  closeDeleteModal () {
    this.setState({deleteItem: null})
  }

  closeEditModal () {
    this.setState({editItem: null})
  }

  closeInsertModal () {
    this.setState({insertItem: false})
  }

  onDelete (item) {
    this.setState({
      deleteItem: item
    })
  }

  // edit form submit (submit button is external to the form component)
  onDeleteSubmit () {
    console.log(this.state)
    let response = this.props.delete(this.state.deleteItem[this.props.idProp])
    response.then(
      success => { this.setState({ deleteItem: null }) },
      error => { this.setState({ error: error.message }) }
    )
  }

  // sets the edited item in state
  onEdit (item) {
    this.setState({
      editItem: item
    })
  }

  // edit form submit (submit button is external to the form component)
  onEditSubmit () {
    const res = this.refs.editForm.submit()
    if (res !== false) { // false means errors
      let response = this.props.edit(res[this.props.idProp], res.data)
      response.then(
        success => { this.setState({ editItem: null }) },
        error => { this.setState({ error: error.message }) }
      )
    }
  }

  onInsert (item) {
    this.setState({
      insertItem: true
    })
  }

  onInsertSubmit () {
    let res = this.refs.insertForm.submit()
    if (res !== false) { // false means errors
      let response = this.props.insert(res.data)
      response.then(
        success => { this.setState({ insertItem: false }) },
        error => { this.setState({ error: error.message }) }
      )
    }
  }

  render () {
    return (
      <Container fluid style={{ padding: '2rem' }}>
        <Segment piled>
          <Label color='orange' ribbon size='big' style={{ marginBottom: '2rem' }}>
            <Icon name={this.props.icon} /> {this.props.title}
          </Label>
          <ChangeList
            onInsert={this.onInsert}
            onEdit={this.onEdit}
            onDelete={this.onDelete}
            {...this.props}
          />
          {this.errorModal()}
          {this.insertModal()}
          {this.editModal()}
          {this.deleteModal()}
        </Segment>
      </Container>
    )
  }

  errorModal () {
    if (this.state.error === false) {
      return null
    }

    return (
      <Modal open basic size='small'>
        <Header icon='warning' content='Error' />
        <Modal.Content>
          <p>{this.state.error}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={() => this.setState({ error: false })}>
            <Icon name='checkmark' /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  insertModal () {
    if (this.state.insertItem === false) {
      return null
    }

    return (
      <Modal open size='small' onClose={this.closeInsertModal}>
        <Modal.Header>Add {this.props.verboseName}</Modal.Header>
        <Modal.Content>
          <this.props.FormComponent
            ref='insertForm'
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' inverted onClick={this.closeInsertModal}>
            <Icon name='remove' /> Cancel
          </Button>
          <Button color='green' inverted onClick={this.onInsertSubmit}>
            <Icon name='save' /> Insert
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  editModal () {
    if (this.state.editItem === null) {
      return null
    }

    return (
      <Modal open size='small' onClose={this.closeEditModal}>
        <Modal.Header>Edit {this.props.verboseName}: {this.state.editItem[this.props.toStringProp]}</Modal.Header>
        <Modal.Content>
          <this.props.FormComponent
            item={this.state.editItem}
            ref='editForm'
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' inverted onClick={this.closeEditModal}>
            <Icon name='remove' /> Cancel
          </Button>
          <Button color='green' inverted onClick={this.onEditSubmit}>
            <Icon name='save' /> Edit
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  deleteModal () {
    if (this.state.deleteItem === null) {
      return null
    }

    return (
      <Modal open size='tiny' onClose={this.closeDeleteModal}>
        <Modal.Header>Delete {this.props.verboseName}: {this.state.deleteItem[this.props.toStringProp]}</Modal.Header>
        <Modal.Content>
          <p>Deleted items cannot be restored. Proceed?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' inverted onClick={this.closeDeleteModal}>
            <Icon name='remove' /> Cancel
          </Button>
          <Button color='green' inverted onClick={this.onDeleteSubmit}>
            <Icon name='trash alternate' /> Delete
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

ModelAdmin.propTypes = {
  icon: PropTypes.string.isRequired, // admin items icon, just ui
  title: PropTypes.string.isRequired, // admin page title
  toStringProp: PropTypes.string.isRequired, // property which represents item as string
  verboseName: PropTypes.string.isRequired, // verbose name of item
  verboseNamePlural: PropTypes.string.isRequired, // verbose name of items
  items: PropTypes.array, // items instances
  listDisplay: PropTypes.array, // items fields to be shown in table
  searchFields: PropTypes.array, // items fields to be searched for
  canInsert: PropTypes.bool, // can the user add items?
  canEdit: PropTypes.func.isRequired, // can the user edit an item? => canEdit(item)
  canDelete: PropTypes.func.isRequired, // can the user delete an item? => canDelete(item)
  insert: PropTypes.func.isRequired, // insert function which calls api
  edit: PropTypes.func.isRequired, // edit function which calls api
  delete: PropTypes.func.isRequired, // delete function which calls api
  FormComponent: PropTypes.func.isRequired, // the add/edit form component
  idProp: PropTypes.string.isRequired, // name of the property used as id
  isLoading: PropTypes.bool
}

export default ModelAdmin
