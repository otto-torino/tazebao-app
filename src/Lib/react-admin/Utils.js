import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import _ from 'lodash'

const ContentLoader = props => (
  <div style={{ minHeight: '100px', position: 'relative' }}>
    <Dimmer active inverted style={{ background: 'transparent' }}>
      <Loader />
    </Dimmer>
  </div>
)

export const withLoader = (Component, isLoading) => {
  if (isLoading !== undefined) {
    // used as function, isLoading is known
    return isLoading ? <ContentLoader /> : Component
  } else {
    // used as HOC, the new component wants a isLoading prop
    return ({ isLoading, ...props }) => {
      return isLoading ? <ContentLoader /> : <Component {...props} />
    }
  }
}

export const varToVerbose = v => _.capitalize(v.replace(/_/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2'))

export const inDiv = (Components, style = {}) => <div style={style}>{Components}</div>

export function getWindowWidth () {
  const win = window
  const doc = document
  const docElem = doc.documentElement
  const body = doc.getElementsByTagName('body')[0]
  return win.innerWidth || docElem.clientWidth || body.clientWidth
}
