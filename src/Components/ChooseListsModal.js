import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Modal, Button, Icon, Form } from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'
import MultipleChoiceField from './MultipleChoiceField'

const ChooseListsModal = props => {
  // translations
  const { t } = useTranslation()
  const lists = useSelector(state => state.lists.data)
  const [selected, setSelected] = useState([])
  return (
    <Modal open size='tiny' onClose={props.onClose}>
      <Modal.Header>{props.title}</Modal.Header>
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
          <Icon name='remove' /> {t('Cancel')}
        </Button>
        <Button
          color='green'
          inverted
          disabled={!selected.length}
          onClick={() => props.onSubmit(selected)}
        >
          <Icon name={props.okButtonIcon} /> {props.okButtonLabel}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ChooseListsModal.defaultProps = {
  title: <Trans>Add selected items to lists</Trans>,
  okButtonIcon: 'save',
  okButtonLabel: <Trans>Save</Trans>
}

ChooseListsModal.propTypes = {
  title: PropTypes.string,
  okButtonIcon: PropTypes.string,
  okButtonLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default ChooseListsModal
