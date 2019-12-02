import React from 'react'
import { Icon } from 'semantic-ui-react'
import { Trans } from 'react-i18next'

export const withData = (fn, props, condition) => {
  if (condition) {
    return fn(props)
  } else {
    return (
      <div>
        <p style={{ textAlign: 'center' }}><Icon name='meh' color='blue' size='huge' /></p>
        <p style={{ textAlign: 'center' }}><Trans>No data</Trans></p>
      </div>
    )
  }
}
