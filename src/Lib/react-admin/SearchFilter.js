import React from 'react'
import PropTypes from 'prop-types'
import { varToVerbose } from './Utils'
import { Input } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const SearchFilter = props => {
  const { t } = useTranslation()
  return (
    <Input
      icon='search'
      placeholder={
        t('Search') + ' ' +
        props.searchFields.map(f => t(varToVerbose(f))).join(', ')
      }
      onChange={props.onChange}
      value={props.value}
      style={{ marginRight: '1rem', marginBottom: '1rem' }}
    />
  )
}

SearchFilter.propTypes = {
  searchFields: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.string
}

export default SearchFilter
