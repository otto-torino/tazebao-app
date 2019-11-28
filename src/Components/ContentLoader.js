import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'


const ContentLoader = props => (
  <div style={{ minHeight: props.minHeight, position: 'relative', ...props.styles }}>
    <Dimmer active inverted style={{ background: 'transparent' }}>
      <Loader />
    </Dimmer>
  </div>
)

ContentLoader.defaultProps = {
  minHeight: '100px'
}

export default ContentLoader
