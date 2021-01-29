import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import { Modal, Button, Icon, Form, Grid, Dimmer, Loader } from 'semantic-ui-react'
import MultipleChoiceField from '../MultipleChoiceField'
import { toast } from 'react-toastify'
import _ from 'lodash'
import styles from './ImportCsvModalForm.module.scss'

const ImportCsvModalForm = props => {
  // translations
  const { t } = useTranslation()
  const lists = useSelector(state => state.lists.data)
  const [selected, setSelected] = useState([])
  const [files, setFiles] = useState([])
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0].path.split('.').pop() === 'csv') {
      setFiles(acceptedFiles)
    } else {
      toast(t('Please choose a CSV file'), { type: 'warning' })
    }
  }, [t, setFiles])

  const handleImport = () => {
    props.onImport(files[0], selected)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  })
  return (
    <Modal open onClose={props.onClose}>
      <Modal.Header>{t('Upload CSV file')}</Modal.Header>
      <Modal.Content>
        {props.loading && (
          <Dimmer active inverted>
            <Loader />
          </Dimmer>
        )}
        <p>{t('upload_csv_description')}</p>
        <ul>
          <li>
            <strong>{t('EMAIL')}</strong>: {t("subscriber's e-mail")}
          </li>
          <li>
            <strong>{t('SUBSCRIPTION DATETIME')}</strong>:{' '}
            {t('upload_subscription_datetime_description')}
          </li>
          <li>
            <strong>{t('INFO')}</strong>:{' '}
            {t('can contain all the needed information in a JSON format')}
          </li>
          <li>
            <strong>{t('OPT IN')}</strong>:{' '}
            {t('upload_subscription_optin_description')}
          </li>
          <li>
            <strong>{t('OPT IN DATETIME')}</strong>:{' '}
            {t('upload_optin_datetime_description')}
          </li>
        </ul>
        <Form>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <label style={{ margin: '1rem 0' }}>{t('Lists')}</label>
                  <MultipleChoiceField
                    items={Object.keys(lists).map(id => ({
                      value: id,
                      label: lists[id].name
                    }))}
                    value={selected}
                    onChange={setSelected}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label style={{ margin: '1rem 0' }}>{t('File')}</label>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className={styles.drop}>
                      {isDragActive ? (
                        <p>{t('Drop the files here...')}</p>
                      ) : (
                        <p>{t('upload_drag_description')}</p>
                      )}
                    </div>
                  </div>
                  {files.length !== 0 && (
                    <div style={{ marginTop: '2rem' }}>
                      <strong>{t('Selected file')}:</strong>
                      <ul>
                        {files.map((f, idx) => <li key={'file-' + idx}>{f.name} ({_.round(f.size / 1e6, 2)} MB)</li>)}
                      </ul>
                    </div>
                  )}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' inverted onClick={props.onClose}>
          <Icon name='remove' /> Cancel
        </Button>
        <Button
          color='green'
          inverted
          disabled={!selected.length || !files.length}
          onClick={handleImport}
        >
          <Icon name='save' /> Save
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ImportCsvModalForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default ImportCsvModalForm
