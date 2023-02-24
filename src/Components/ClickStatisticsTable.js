import React from 'react'
import PropTypes from 'prop-types'

import { Label, Table } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { apply, groupBy, head, keys, length, map, objOf, pipe, prop, reverse, sortBy, toPairs, values } from 'ramda'

const ClickTrackingTable = ({ events }) => {
  const { t } = useTranslation()
  const freqOrderedEvents = pipe(
    groupBy(prop('notes')),
    map(length), pipe(toPairs, map(apply(objOf))),
    sortBy(pipe(values, head)),
    reverse
  )(events)

  return (
    <Table compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            URL
          </Table.HeaderCell>
          <Table.HeaderCell>
            {t('Click count')}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {freqOrderedEvents.map((obj, idx) => (
          <Table.Row key={'event-' + idx}>
            <Table.Cell>
              <a href={pipe(keys, head)(obj)} target='_blank' rel='noopener noreferrer'>
                {pipe(keys, head)(obj)}
              </a>
            </Table.Cell>
            <Table.Cell><Label color='teal'>{pipe(values, head)(obj)}</Label></Table.Cell>
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
