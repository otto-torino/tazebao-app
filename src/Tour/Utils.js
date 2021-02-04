import React from 'react'
import { Icon } from 'semantic-ui-react'
import history from '../history'
import i18next from 'i18next'
import config from '../Config'

export const nextButton = (goTo, step) => (
  <div style={{ textAlign: 'right' }}>
    <Icon link name='arrow right' onClick={() => goTo(step)} style={{ margin: 0 }} />
  </div>
)

export const closeButton = close => (
  <div style={{ textAlign: 'right' }}>
    <strong
      style={{ cursor: 'pointer' }}
      onClick={() => {
        close()
      }}
    >
      {i18next.t('END TOUR')}
    </strong>
  </div>
)
