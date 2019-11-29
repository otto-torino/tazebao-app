import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Table, Icon, Checkbox } from 'semantic-ui-react'

const BouncesTable = ({ bounces, onSelectionChange }) => {
  const [selected, setSelected] = useState([])
  const toggleAll = useCallback((e, { checked }) => {
    const s = checked ? bounces.map(b => b.id) : []
    setSelected(s)
    onSelectionChange(s)
  })
  return (
    <Table compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            <Checkbox toggle onChange={toggleAll} />
          </Table.HeaderCell>
          <Table.HeaderCell>
            Date&Time
          </Table.HeaderCell>
          <Table.HeaderCell>
            E-mail
          </Table.HeaderCell>
          <Table.HeaderCell>
            Message
          </Table.HeaderCell>
          <Table.HeaderCell>
            Status
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {bounces.map((b, idx) => (
          <Table.Row key={'bounce-' + idx}>
            <Table.Cell>
              <Checkbox
                toggle
                checked={selected.indexOf(b.id) !== -1}
                onChange={(e, { checked }) => {
                  const index = selected.indexOf(b.id)
                  let s
                  if (index !== -1 && !checked) {
                    s = selected.filter(id => id !== b.id)
                  } else if (index === -1 && checked) {
                    s = [b.id, ...selected]
                  }
                  setSelected(s)
                  onSelectionChange(s)
                }}
              />
            </Table.Cell>
            <Table.Cell>{moment(b.datetime).format('LLL')}</Table.Cell>
            <Table.Cell>{b.subscriber_email}</Table.Cell>
            <Table.Cell>{b.message}</Table.Cell>
            <Table.Cell>{b.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

BouncesTable.propTypes = {
  bounces: PropTypes.array,
  onSelectionChange: PropTypes.func
}

export default BouncesTable
