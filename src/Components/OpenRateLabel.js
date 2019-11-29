import React from 'react'
import PropTypes from 'prop-types'
import { Label } from 'semantic-ui-react'

const OpenRateLabel = ({ rate }) => {
  let color = 'green'
  if (rate > 30) {
    color = 'green'
  } else if (rate > 20) {
    color = 'yellow'
  } else if (rate > 10) {
    color = 'orange'
  }
  return (
    <Label color={color}>{rate}%</Label>
  )
}

OpenRateLabel.propTypes = {
  rate: PropTypes.number
}

export default OpenRateLabel
