import React from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox } from 'semantic-ui-react'

/**
 * Controlled multiple choice field
 */
const MultipleChoiceField = props => {
  return (
    <div>
      {props.label && <label>{props.label}</label>}
      {props.items.map(item => (
        <Form.Field key={item.value}>
          <Checkbox
            label={item.label}
            checked={props.value.indexOf(item.value) !== -1}
            onChange={(e, { checked }) => {
              const index = props.value.indexOf(item.value)
              const copy = [...props.value]
              if (checked && index === -1) {
                // add
                copy.push(item.value)
              } else if (!checked && index !== -1) {
                // remove
                copy.splice(index, 1)
              }
              props.onChange(copy)
            }}
          />
        </Form.Field>
      ))}
    </div>
  )
}

MultipleChoiceField.defaultProps = {
  label: null
}

MultipleChoiceField.propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.array
}

export default MultipleChoiceField
