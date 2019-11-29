import React from 'react'
import ContentLoader from '../Components/ContentLoader'

export const withLoader = (Component, isLoading) => {
  if (isLoading !== undefined) {
    // used as function, isLoading is known, component can be a function if some params are not yet ready
    return isLoading ? <ContentLoader /> : (typeof Component === 'function' ? Component() : Component)
  } else {
    // used as HOC, the new component wants a isLoading prop
    return ({ isLoading, ...props }) => {
      return isLoading ? <ContentLoader /> : <Component {...props} />
    }
  }
}
