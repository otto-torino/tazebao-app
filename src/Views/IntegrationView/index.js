import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import ContentLoader from '../../Components/ContentLoader'
import {
  Segment,
  Container,
  Label,
  Icon,
  Header,
  Grid,
  Message,
  Tab
} from 'semantic-ui-react'
import { withLoader } from '../../HOC/Loader'
import config from '../../Config'
import { request } from '../../Services/Request'
import { layoutProps } from '../../Styles/Common'
import { useTranslation, Trans } from 'react-i18next'
import PHPIntegration from '../../Components/PHPIntegration'
import PythonIntegration from '../../Components/PythonIntegration'
import moment from 'moment'

import styles from './IntegrationView.module.scss'

const IntegrationView = props => {
  const { t } = useTranslation()
  const isLoading = useSelector(state => state.auth.fetching)
  const client = useSelector(state => state.auth.user.client)

  const panes = [
    {
      menuItem: 'PHP',
      render: () => <PHPIntegration client={client} />
    },
    {
      menuItem: 'Python',
      render: () => <PythonIntegration client={client} />
    }
  ]

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <Container {...layoutProps.containerProps}>
        {withLoader(
          () => (
            <Segment {...layoutProps.segmentProps}>
              <Label {...layoutProps.labelProps}>
                <Icon name='globe' /> {t('Integration')}
              </Label>
              <Grid stackable doubling columns={2}>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <p><Trans>integration_description</Trans>)</p>
                    <div className={styles.keys}>
                      <p><strong>Id Key</strong>: {client.idKey}</p>
                      <p><strong>Secret Key</strong>: {client.secretKey}</p>
                    </div>
                    <p>
                      {t('integration_api_link_description')}
                      <a href='https://github.com/otto-torino/tazebao' target='_blank'>{t('project\'s GitHub page')}</a>
                    </p>
                  </Grid.Column>
                  <Grid.Column width={12}>
                    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          ),
          isLoading === 0
        )}
      </Container>
    </BaseLayout>
  )
}

IntegrationView.propTypes = {
  match: PropTypes.object
}

export default IntegrationView
