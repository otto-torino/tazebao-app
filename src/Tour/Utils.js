import React from 'react'
import i18next from 'i18next'

export const nextButton = (goTo, step) => (
  <div style={{ textAlign: 'right' }}>
    <strong style={{ cursor: 'pointer', margin: 0 }} onClick={() => goTo(step)}>
      {i18next.t('NEXT')}
    </strong>
  </div>
)

export const closeButton = (close) => (
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
