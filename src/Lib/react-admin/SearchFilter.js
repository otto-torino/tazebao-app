import React from 'react'
import PropTypes from 'prop-types'
import { varToVerbose } from './Utils'
import { Input } from 'semantic-ui-react'

const SearchFilter = props => (
  <Input
    icon='search'
    placeholder={
      'Search ' +
      props.searchFields.map(f => varToVerbose(f)).join(', ')
    }
    onChange={props.onChange}
    style={{ marginRight: '1rem', marginBottom: '1rem' }}
  />
)

SearchFilter.propTypes = {
  searchFields: PropTypes.array,
  onChange: PropTypes.func
}

export default SearchFilter
