import React, { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import PropTypes from 'prop-types'

import {
  Segment,
  Header,
  Container,
  Label,
  Icon,
  Modal,
  Button
} from 'semantic-ui-react'

import { getWindowWidth } from './Utils'

const windowWidth = getWindowWidth()

const ModelAdmin = props => {
  const { t } = useTranslation()
  const [insertItem, setInsertItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [error, setError] = useState(false)
  const [qs, setQueryString] = useState({})
  const insertForm = useRef(null)
  const editForm = useRef(null)

  const closeInsertModal = useCallback(() => setInsertItem(null), [setInsertItem])
  const closeEditModal = useCallback(() => setEditItem(null), [setEditItem])
  const closeDeleteModal = useCallback(() => setDeleteItem(null), [setDeleteItem])
  const closeErrorModal = useCallback(() => setError(null), [setError])

  const handleInsert = () => setInsertItem(true)
  const handleEdit = item => setEditItem(item)
  const handleDelete = item => setDeleteItem(item)
  const handleQueryString = qs => setQueryString(qs)

  // let's insert
  const insertSubmit = () => {
    const res = insertForm.current.submit()
    if (res !== false) {
      // false means errors
      const response = props.onInsert(res.data, qs)
      response.then(
        closeInsertModal, // success
        error => setError(error.message)
      )
    }
  }

  // edit form submit (submit button is external to the form component)
  const editSubmit = () => {
    const res = editForm.current.submit()
    if (res !== false) {
      // false means errors
      const response = props.onEdit(res[props.idProp], res.data, qs)
      response.then(
        closeEditModal, // success
        error => setError(error.message)
      )
    }
  }

  // let's delete
  const deleteSubmit = () => {
    const response = props.onDelete(deleteItem[props.idProp], qs)
    response.then(
      closeDeleteModal, // success
      error => setError(error.message)
    )
  }

  // insert edit and delete have similar modals
  const formModal = (
    header,
    content,
    onClose,
    onSave,
    saveString,
    saveIcon = 'save'
  ) => (
    <Modal open size='small' onClose={onClose}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>{content}</Modal.Content>
      <Modal.Actions>
        <Button color='red' inverted onClick={onClose}>
          <Icon name='remove' /> {t('Cancel')}
        </Button>
        <Button color='green' inverted onClick={onSave}>
          <Icon name={saveIcon} /> {saveString}
        </Button>
      </Modal.Actions>
    </Modal>
  )

  const insertModal = () =>
    formModal(
      t('Add') + ` ${props.verboseName}`,
      <props.FormComponent ref={insertForm} {...props.formProps} />,
      closeInsertModal,
      insertSubmit,
      t('Insert')
    )
  const editModal = () =>
    formModal(
      t('Edit') + ` ${props.verboseName}: ${editItem[props.toStringProp]}`,
      <props.FormComponent
        item={editItem}
        ref={editForm}
        {...props.formProps}
      />,
      closeEditModal,
      editSubmit,
      t('Edit')
    )
  const deleteModal = () =>
    formModal(
      t('Delete') + ` ${props.verboseName}: ${deleteItem[props.toStringProp]}`,
      props.deleteModalContent,
      closeDeleteModal,
      deleteSubmit,
      t('Delete'),
      'trash alternate'
    )

  const errorModal = () => {
    return (
      <Modal open basic size='small'>
        <Header icon='warning' content='Error' />
        <Modal.Content>
          <p>{error}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={closeErrorModal}>
            <Icon name='checkmark' /> {t('Close')}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  return (
    <Container {...props.containerProps}>
      <Segment {...props.segmentProps}>
        <Label {...props.labelProps}>
          <Icon name={props.icon} /> {props.title}
        </Label>
        {props.children({
          handleInsert,
          handleEdit,
          handleDelete,
          handleQueryString,
          idProp: props.idProp,
          verboseName: props.verboseName,
          verboseNamePlural: props.verboseNamePlural
        })}
        {insertItem && insertModal()}
        {editItem && editModal()}
        {deleteItem && deleteModal()}
        {error && errorModal()}
      </Segment>
    </Container>
  )
}

ModelAdmin.defaultProps = {
  containerProps: {
    fluid: true,
    style: windowWidth > 500
      ? { padding: '2rem' }
      : { padding: 0, margin: 0 }
  },
  segmentProps: {
    piled: windowWidth > 500,
    basic: windowWidth <= 500,
    style: windowWidth > 500
      ? {}
      : { padding: 0, paddingTop: '3rem' }
  },
  labelProps: {
    color: windowWidth > 500 ? 'orange' : '',
    attached: windowWidth <= 500 ? 'top' : null,
    ribbon: windowWidth > 500,
    size: 'big',
    style: {
      marginBottom: '2rem'
    }
  },
  formProps: {},
  deleteModalContent: <Trans>Deleted items cannot be restored. Proceed?</Trans>
}

ModelAdmin.propTypes = {
  children: PropTypes.func,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  containerProps: PropTypes.object,
  segmentProps: PropTypes.object,
  labelProps: PropTypes.object,
  idProp: PropTypes.string,
  verboseName: PropTypes.string.isRequired,
  verboseNamePlural: PropTypes.string.isRequired,
  toStringProp: PropTypes.string,
  FormComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  formProps: PropTypes.object,
  onInsert: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  deleteModalContent: PropTypes.object
}

export default ModelAdmin
