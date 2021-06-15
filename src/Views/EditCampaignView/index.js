import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import Mosaico from '../../Components/Mosaico'
import { toast } from 'react-toastify'
import { Segment, Container, Label, Icon, Button } from 'semantic-ui-react'
import ChooseListsModal from '../../Components/ChooseListsModal'
import CampaignForm from '../../Forms/CampaignForm'
import { withLoader } from '../../HOC/Loader'
import { layoutProps } from '../../Styles/Common'
import history from '../../history'
import { useTranslation } from 'react-i18next'
import config from '../../Config'
import { request } from '../../Services/Request'

import styles from './EditCampaignView.module.scss'

const EditCampaignView = props => {
  const { t } = useTranslation()
  const id = props.match.params ? parseInt(props.match.params.id) : null
  const campaigns = useSelector(state => state.campaigns.data)
  const campaign = id ? campaigns.filter(c => c.id === id)[0] : null
  const mosaicoFrame = useRef(null)
  const campaignForm = useRef(null)
  const [enableSave, setEnableSave] = useState(false)
  const [testModalIsOpen, setTestModalIsOpen] = useState(false)
  const [template, saveTemplate] = useState({})
  const topics = useSelector(state => state.topics.data)

  const handleSave = (continueEditing, test = false, lists = []) => () => {
    const data = campaignForm.current.submit()
    if (data) {
      mosaicoFrame.current.contentWindow.postMessage(
        {
          type: 'TAZEBAO',
          data: {
            event: 'SAVE',
            // add id otherwise a new campaign is created every time
            fields: Object.assign({}, data.data, { id: data.id }),
            continueEditing,
            test,
            lists
          }
        },
        '*'
      )
    }
  }

  const handleTest = listIds => {
    handleSave(true, true, listIds)()
  }

  const sendTest = useCallback((campaignId, listIds) => {
    if (!listIds || !listIds.length) {
      return
    }
    request(
      'testCampaign',
      [campaignId, listIds, true],
      t('Cannot test the campaign') + ': {error}',
      response => {
        // show toast and redirect to home
        toast.info(t('The test dispatch will be sent in a moment') + '!')
        setTestModalIsOpen(false)
      },
      error => console.log(error)
    )
  }, [setTestModalIsOpen, t])

  useEffect(() => {
    const listener = function ({ data }) {
      const { type } = data
      if (type === 'TAZEBAO') {
        const { event, campaignId, continueEditing, test, lists } = data.data
        if (event === 'READY') {
          setEnableSave(true)
        } else if (event === 'SAVE') {
          if (continueEditing) {
            toast.success(t('Campaign succesfully saved'))
            history.push(config.urls.editCampaign.replace(':id', campaignId))
            if (test && lists) {
              sendTest(campaignId, lists)
            }
          } else {
            toast.success(t('Campaign succesfully saved'))
            setTimeout(() => {
              history.push(config.urls.sendCampaign.replace(':id', campaignId))
            }, 1000)
          }
        }
      }
    }
    window.addEventListener('message', listener)

    if (id) {
      request(
        'campaignTemplate',
        [id],
        t('Cannot fetch saved campaign'),
        response => {
          saveTemplate(response.data)
        },
        error => console.log(error)
      )
    }

    return () => {
      window.removeEventListener('message', listener)
    }
  }, [id, sendTest, t])

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <Container {...layoutProps.containerProps}>
        {withLoader(
          <Segment {...layoutProps.segmentProps}>
            <Label {...layoutProps.labelProps}>
              <Icon name='newspaper outline' /> {campaign ? campaign.name : t('Create campaign')}
            </Label>
            <div className={styles.grid}>
              <div className={styles.row}>
                <div className={styles.columnForm}>
                  <div>
                    <CampaignForm
                      ref={campaignForm}
                      item={campaign ? Object.assign({}, campaign, { topic: campaign.topic_id }) : {}}
                      topics={Object.keys(topics).map(id => topics[id])}
                    />
                    {enableSave && (
                      <p style={{ textAlign: 'center', margin: '3rem 0 1rem' }} data-tour='create-campaign-submit-row'>
                        <Button color='green' onClick={handleSave(true)}>
                          <Icon name='save' />
                          {t('Save and continue editing')}
                        </Button>
                        <Button color='green' onClick={handleSave(false)}>
                          <Icon name='save' />
                          {t('Save')}
                        </Button>
                        <Button color='blue' onClick={() => setTestModalIsOpen(true)}>
                          <Icon name='send' />
                          {t('Test')}
                        </Button>
                      </p>
                    )}
                  </div>
                </div>
                <div data-tour='create-campaign-mosaico' className={styles.columnMosaico}>
                  {(!id || (id && Object.keys(template).length)) && (
                    <Mosaico
                      windowRef={mosaicoFrame}
                      template={template}
                    />
                  )}
                  {enableSave && (
                    <p style={{ textAlign: 'center', margin: '3rem 0 1rem' }}>
                      <Button color='green' onClick={handleSave(true)}>
                        <Icon name='save' />
                        {t('Save and continue editing')}
                      </Button>
                      <Button color='green' onClick={handleSave(false)}>
                        <Icon name='save' />
                        {t('Save')}
                      </Button>
                      <Button color='blue' onClick={() => setTestModalIsOpen(true)}>
                        <Icon name='send' />
                        {t('Test')}
                      </Button>
                    </p>
                  )}
                </div>
              </div>
            </div>
            {testModalIsOpen && (
              <ChooseListsModal
                onClose={() => setTestModalIsOpen(false)}
                onSubmit={handleTest}
                okButtonIcon='send'
                okButtonLabel='save and test'
                title={t('Select lists for test dispatch')}
              />
            )}
          </Segment>,
          id && campaigns.length === 0
        )}
      </Container>
    </BaseLayout>
  )
}

EditCampaignView.propTypes = {
  match: PropTypes.object
}

export default EditCampaignView
