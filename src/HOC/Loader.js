import React from 'react'
import ContentLoader from '../Components/ContentLoader'

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
