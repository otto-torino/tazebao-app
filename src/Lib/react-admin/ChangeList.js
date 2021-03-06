import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import { withLoader, varToVerbose, inDiv } from './Utils'
import {
  Table,
  Pagination,
  Icon,
  Button,
  Select,
  Checkbox
} from 'semantic-ui-react'
import SearchFilter from './SearchFilter'
import {
  usePagination,
  useSorting,
  useFullTextSearch,
  useListFilters
} from './Hooks'

const ChangeList = props => {
  // translations
  const { t } = useTranslation()
  // checkboxes, actions to be performed on selected items
  const [selectedItems, setSelectedItems] = useState([])
  const [allSelected, setAllSelected] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)

  // data manipulation
  // full text search
  const [search, setSearch, textFilteredItems] = useFullTextSearch(
    props.items.slice(),
    props.searchFields,
    ''
  )
  // apply filters
  const [filters, setFilters, filteredItems] = useListFilters(
    textFilteredItems,
    props.listFilters
  )
  // sorting
  const [sort, setSort, sortedItems] = useSorting(
    filteredItems,
    props.sortField,
    props.sortDirection
  )
  // pagination
  const [page, setPage, items] = usePagination(sortedItems, props.listPerPage)
  const handlePageChange = useCallback((e, { activePage }) =>
    setPage(activePage)
  )

  //  insert/edit/delete
  const insertRecord = () => {
    return props.canInsert ? props.onInsert() : null
  }
  const editRecord = item => {
    return props.canEdit(item) ? props.onEdit(item) : null
  }
  const deleteRecord = item => {
    return props.canDelete(item) ? props.onDelete(item) : null
  }

  // shortcuts
  const listFiltersLength = Object.keys(props.listFilters).length
  const listActionsLength = Object.keys(props.listActions).length

  // toolbar search input
  const searchFilter = () =>
    inDiv(
      <SearchFilter
        searchFields={props.searchFields}
        onChange={(e, { value }) => {
          setAllSelected(false)
          setPage(1)
          setSearch(value)
        }}
      />
    )

  // toolbar list filters
  const listFilters = () => {
    return inDiv(
      Object.keys(props.listFilters).map(f => (
        <Select
          key={'filter-' + f}
          placeholder={t('Select') + ' ' + props.listFilters[f].label}
          options={props.listFilters[f].options}
          onChange={(e, { value }) => {
            setAllSelected(false)
            setPage(1)
            const copy = { ...filters }
            if (value === null) {
              delete copy[f]
            } else {
              copy[f] = value
            }
            setFilters(copy)
          }}
          style={{ marginRight: '1rem', marginBottom: '1rem' }}
        />
      )),
      { display: 'flex', flexWrap: 'wrap' }
    )
  }

  // toolbar actions
  const listActions = () => {
    return inDiv(
      <Select
        key='list-actions'
        placeholder={t('Perform action on selected items')}
        disabled={!selectedItems.length}
        value={selectedAction}
        options={[
          { value: null, text: t('Perform action on selected items'), key: 0 },
          ...Object.keys(props.listActions).map(a => ({
            value: a,
            text: props.listActions[a].label,
            key: a
          }))
        ]}
        onChange={(e, { value }) => {
          value !== null && props.listActions[value].action(selectedItems)
          setSelectedAction(null)
        }}
        style={{ marginBottom: '1rem' }}
      />
    )
  }

  // table header
  const header = () => {
    return (
      <Table.Row>
        {!!listActionsLength && (
          <Table.HeaderCell collapsing>
            <Checkbox
              checked={allSelected}
              toggle
              onChange={(e, { checked }) => {
                setAllSelected(checked)
                setSelectedItems(
                  checked ? filteredItems.map(i => i[props.idProp]) : []
                )
              }}
            />
          </Table.HeaderCell>
        )}
        {props.listDisplay.map(field => (
          <Table.HeaderCell
            key={'th-' + field}
            onClick={() =>
              setSort({
                field,
                direction: sort.direction === 'asc' ? 'desc' : 'asc'
              })}
          >
            <div
              style={{
                whiteSpace: 'nowrap',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              {t(varToVerbose(field))}
              <Icon
                name={
                  sort.field === field && sort.direction === 'asc'
                    ? 'angle up'
                    : 'angle down'
                }
                style={sort.field === field ? {} : { color: '#fff' }}
              />
            </div>
          </Table.HeaderCell>
        ))}
        <Table.HeaderCell key='th-actions' style={{ whiteSpace: 'nowrap' }} />
      </Table.Row>
    )
  }

  // record
  const row = item => {
    const cells = []

    if (listActionsLength) {
      cells.push(
        <Table.Cell key='select-item' collapsing>
          <Checkbox
            toggle
            checked={selectedItems.indexOf(item[props.idProp]) !== -1}
            onChange={(e, { checked }) => {
              const index = selectedItems.indexOf(item[props.idProp])
              if (index !== -1 && !checked) {
                setSelectedItems(
                  selectedItems.filter(id => id !== item[props.idProp])
                )
              } else if (index === -1 && checked) {
                setSelectedItems([item[props.idProp], ...selectedItems])
              }
            }}
          />
        </Table.Cell>
      )
    }
    props.listDisplay.forEach((field, idx) => {
      const collapsing = idx === 0
      const value = _.get(item, field)
      let valueString
      if (props.fieldsMapping && props.fieldsMapping[field]) {
        valueString = props.fieldsMapping[field](value)
      } else {
        valueString =
          typeof value === 'boolean' ? (
            <Icon
              name={value ? 'thumbs up' : 'thumbs down'}
              color={value ? 'green' : 'red'}
            />
          ) : (
            value
          )
      }
      cells.push(
        <Table.Cell collapsing={collapsing} key={'cell-' + idx}>
          {valueString}
        </Table.Cell>
      )
    })

    // single record actions
    let actions = props.moreActions(item);
    ['edit', 'delete'].forEach(a => {
      if (!props.hideButtonWithoutPermissions || props['can' + _.upperFirst(a)](item)) {
        actions.push(
          <Icon
            title={props['can' + _.upperFirst(a)](item) ? a : null}
            name={a === 'edit' ? 'pencil' : 'trash'}
            circular
            color='blue'
            disabled={!props['can' + _.upperFirst(a)](item)}
            onClick={() => (a === 'edit' ? editRecord(item) : deleteRecord(item))}
            key={a + '-btn'}
            style={{
              cursor: props['can' + _.upperFirst(a)](item) ? 'pointer' : 'default'
            }}
          />
        )
      }
    })
    cells.push(
      <Table.Cell collapsing key='cell-actions' textAlign='right'>
        {actions}
      </Table.Cell>
    )
    return (
      <Table.Row key={item[props.idProp] || Math.random()}>{cells}</Table.Row>
    )
  }

  // finally...
  return (
    <div className='changelist' style={{ maxWidth: '100%', overflow: 'auto' }}>
      {props.description ? <div style={{ marginBottom: '2rem' }}>{props.description}</div> : null}
      <div
        className='changelist-tools'
        style={{
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {!!props.searchFields.length && searchFilter()}
          {!!listFiltersLength && listFilters()}
          {!!listActionsLength && listActions()}
        </div>
        <div>
          {(!props.hideButtonWithoutPermissions || props.canInsert) &&  (
            <Button
              disabled={!props.canInsert}
              color='blue'
              onClick={insertRecord}
              icon
              style={{ marginBottom: '1rem' }}
            >
              <Icon name='plus' /> {t('Add')} {props.verboseName}
            </Button>
          )}
          {props.toolbarButtons}
        </div>
      </div>
      {withLoader(
        <div>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  colSpan={
                    props.listDisplay.length + 1 + (listActionsLength ? 1 : 0)
                  }
                >
                  {filteredItems.length}{' '}
                  {filteredItems.length === 1
                    ? props.verboseName
                    : props.verboseNamePlural}
                  {search || Object.keys(filters).length
                    ? ' (' + props.items.length + ' ' + t('totalp') + ')'
                    : ''}
                  {selectedItems.length
                      ? ' (' + selectedItems.length + ' ' + t(selectedItems.length > 1 ? 'selectedp' : 'selecteds') + ')'
                    : null}
                </Table.HeaderCell>
              </Table.Row>
              {header()}
            </Table.Header>
            <Table.Body>{items.map(item => row(item))}</Table.Body>
          </Table>
          <div style={{ maxWidth: '100%', overflow: 'auto' }}>
            <Pagination
              activePage={page}
              onPageChange={handlePageChange}
              totalPages={Math.ceil(filteredItems.length / props.listPerPage)}
            />
          </div>
        </div>,
        props.isLoading
      )}
    </div>
  )
}

ChangeList.defaultProps = {
  listPerPage: 10,
  listDisplay: [],
  canInsert: true,
  canEdit: item => true,
  canDelete: item => true,
  idProp: 'id',
  searchFields: [],
  listFilters: {},
  listActions: {},
  description: null,
  hideButtonWithoutPermissions: false,
  moreActions: item => [],
  toolbarButtons: null
}

ChangeList.propTypes = {
  items: PropTypes.array,
  description: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  idProp: PropTypes.string,
  listDisplay: PropTypes.array,
  listFilters: PropTypes.object,
  listActions: PropTypes.object,
  searchFields: PropTypes.array,
  listPerPage: PropTypes.number,
  fieldsMapping: PropTypes.object,
  verboseName: PropTypes.string.isRequired,
  verboseNamePlural: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  canInsert: PropTypes.bool,
  canEdit: PropTypes.func,
  canDelete: PropTypes.func,
  sortField: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  onInsert: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  hideButtonWithoutPermissions: PropTypes.bool,
  moreActions: PropTypes.func,
  toolbarButtons: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.array
  ])
}

export default ChangeList
