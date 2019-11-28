import React from 'react'
import { Icon } from 'semantic-ui-react'

export const withData = (fn, props, condition) => {
  if (condition) {
    // used as function, isLoading is known
    return fn(props)
  } else {
    return (
      <div>
        <p style={{ textAlign: 'center' }}><Icon name='meh' color='blue' size='huge' /></p>
        <p style={{ textAlign: 'center' }}>No data</p>
      </div>
    )
  }
}
