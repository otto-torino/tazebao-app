import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Modal, Button, Icon, Form, Checkbox } from 'semantic-ui-react'
import MultipleChoiceField from './MultipleChoiceField'

const ChooseListsModal = props => {
  const lists = useSelector(state => state.lists.data)
  const [selected, setSelected] = useState([])
  console.log('FORM', selected)
  return (
    <Modal open size='tiny' onClose={props.onClose}>
      <Modal.Header>Add selected items to lists</Modal.Header>
      <Modal.Content>
        <Form>
          <MultipleChoiceField
            items={Object.keys(lists).map(id => ({ value: id, label: lists[id].name }))}
            value={selected}
            onChange={setSelected}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' inverted onClick={props.onClose}>
          <Icon name='remove' /> Cancel
        </Button>
        <Button
          color='green'
          inverted
          disabled={!selected.length}
          onClick={() => props.onSubmit(selected)}
        >
          <Icon name='save' /> Save
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ChooseListsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default ChooseListsModal
