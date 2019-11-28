import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const Startup = () => (
  <div>
    <Dimmer active>
      <Loader>Loading</Loader>
    </Dimmer>
  </div>
)

export default Startup
