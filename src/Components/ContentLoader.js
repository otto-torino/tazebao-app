import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'


const ContentLoader = props => (
  <div style={{ width: props.width, minHeight: props.minHeight, position: 'relative', ...props.styles }}>
    <Dimmer active inverted style={{ background: 'transparent' }}>
      <Loader />
    </Dimmer>
  </div>
)

ContentLoader.defaultProps = {
  minHeight: '100px',
  width: '100%'
}

export default ContentLoader
