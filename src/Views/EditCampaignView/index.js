import React, { useState, useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import Mosaico from '../../Components/Mosaico'
import { toast } from 'react-toastify'
import { Segment, Container, Label, Icon, Button } from 'semantic-ui-react'
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
  const [template, saveTemplate] = useState({})
  const topics = useSelector(state => state.topics.data)

  useEffect(() => {
    console.log('RUNNING EFFECT')
    const listener = function ({ data }) {
      const { type } = data
      console.log('RECEIVED', data)
      if (type === 'TAZEBAO') {
        const { event, campaignId, continueEditing } = data.data
        if (event === 'READY') {
          console.log('SETTING SAVE')
          setEnableSave(true)
        } else if (event === 'SAVE') {
          if (continueEditing) {
            toast.success('Campaign succesfully saved')
            history.push(config.urls.editCampaign.replace(':id', campaignId))
          } else {
            toast.success('Campaign succesfully saved')
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
  }, [id])

  const handleSave = continueEditing => () => {
    const data = campaignForm.current.submit()
    if (data) {
      mosaicoFrame.current.contentWindow.postMessage(
        {
          type: 'TAZEBAO',
          data: {
            event: 'SAVE',
            // add id otherwise a new campaign is created every time
            fields: Object.assign({}, data.data, { id: data.id }),
            continueEditing: continueEditing
          }
        },
        '*'
      )
    }
  }

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
                      <p style={{ textAlign: 'center', margin: '3rem 0 1rem' }}>
                        <Button color='green' onClick={handleSave(true)}>
                          {t('Save and continue editing')}
                        </Button>
                        <Button color='green' onClick={handleSave(false)}>
                          {t('Save')}
                        </Button>
                      </p>
                    )}
                  </div>
                </div>
                <div className={styles.columnMosaico}>
                  {(!id || (id && Object.keys(template).length)) && (
                    <Mosaico
                      windowRef={mosaicoFrame}
                      template={template}
                    />
                  )}
                  {enableSave && (
                    <p style={{ textAlign: 'center', margin: '3rem 0 1rem' }}>
                      <Button color='green' onClick={handleSave(true)}>
                        {t('Save and continue editing')}
                      </Button>
                      <Button color='green' onClick={handleSave(false)}>
                        {t('Save')}
                      </Button>
                    </p>
                  )}
                </div>
              </div>
            </div>
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
