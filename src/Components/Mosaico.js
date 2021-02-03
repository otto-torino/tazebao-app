import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import config from '../Config'

window.addEventListener('message', function ({ data }) {
  if (data.action === 'TAZEBAO') {
  }
})

const Mosaico = props => {
  const token = useSelector(state => state.auth.token)

  const src =
    props.template && props.template.id
      ? `${config.mosaicoBasePath}/appeditor.html?bearer=${token}&id=${props.template.id}`
      : `${config.mosaicoBasePath}/app.html?bearer=${token}`

  return (
    <iframe
      title='Mosaico'
      ref={props.windowRef}
      id='mosaico-iframe'
      frameBorder={0}
      src={src}
      style={{ width: '100%', height: '760px' }}
      onLoad={() => console.log('iframe loaded', props.windowRef.current.src)}
    />
  )
}

// src={`http://localhost:8000/mosaico/appeditor.html?bearer=${token}#/static/mosaico/templates/versafix-1/template-versafix-1.html`}

Mosaico.propTypes = {
  windowRef: PropTypes.object,
  template: PropTypes.object
}

export default React.memo(Mosaico)
