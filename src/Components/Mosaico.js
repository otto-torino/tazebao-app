import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import config from '../Config'

window.addEventListener('message', function ({ data }) {
  if (data.action === 'TAZEBAO') {
  }
})

class Mosaico extends React.Component {
  shouldComponentUpdate (nextProps) {
    // if only token has been refreshed do not upload, otherwise the iframe is rendered again and reloads
    if (nextProps.token && this.props.token && this.props.token !== nextProps.token) {
      return false
    }
    return true
  }

  render () {
    const { token, windowRef, template } = this.props
    console.log('RENDERING', token)

    const src =
      template && template.id
        ? `${config.mosaicoBasePath}/appeditor.html?bearer=${token}&id=${template.id}`
        : `${config.mosaicoBasePath}/app.html?bearer=${token}`

    return (
      <iframe
        title='Mosaico'
        ref={windowRef}
        id='mosaico-iframe'
        frameBorder={0}
        src={src}
        style={{ width: '100%', height: '760px' }}
        onLoad={() => console.log('iframe loaded', windowRef.current.src)}
      />
    )
  }
}

// src={`http://localhost:8000/mosaico/appeditor.html?bearer=${token}#/static/mosaico/templates/versafix-1/template-versafix-1.html`}

const mapStateToProps = state => ({ token: state.auth.token })

Mosaico.propTypes = {
  windowRef: PropTypes.object,
  template: PropTypes.object,
  token: PropTypes.string
}

export default connect(mapStateToProps, null)(Mosaico)
