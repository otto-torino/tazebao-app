import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Table } from 'semantic-ui-react'

const ClickTrackingTable = ({ events }) => {
  return (
    <Table compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            Date&Time
          </Table.HeaderCell>
          <Table.HeaderCell>
            E-mail
          </Table.HeaderCell>
          <Table.HeaderCell>
            URL
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {events.map((e, idx) => (
          <Table.Row key={'event-' + idx}>
            <Table.Cell>{moment(e.datetime).format('LLL')}</Table.Cell>
            <Table.Cell>{e.subscriber_email}</Table.Cell>
            <Table.Cell><a href={e.notes} target='_blank'>{e.notes}</a></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

ClickTrackingTable.propTypes = {
  events: PropTypes.array
}

export default ClickTrackingTable
