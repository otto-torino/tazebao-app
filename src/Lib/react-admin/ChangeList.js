import React, { useState } from 'react'
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

/**
 * ChangeList
 *
 * This component can wirkl with a whole set of data, or a paginated set of data.
 * In case of a whole set of data, it manages directly pagination, sorting,
 * filtering and full text search. In case of paginated set of data id relies on
 * changing the queryset object which stores all this information (page, sort, filter, full-text)
 * calling the onUpdateQuerystring function.
 */
const ChangeList = props => {
  // translations
  const { t } = useTranslation()

  // manage pageinated data sets
  const { querystring, onUpdateQuerystring, isWholeDataSet } = props

  // checkboxes, actions to be performed on selected items
  const [selectedItems, setSelectedItems] = useState([])
  const [allSelected, setAllSelected] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)

  // data manipulation
  // full text search
  const [search, setSearch, textFilteredItems] = useFullTextSearch(
    props.items.slice(),
    props.searchFields,
    querystring.q || '',
    isWholeDataSet
  )
  const handleSearch = (e, { value }) => {
    setAllSelected(false)
    setPage(1)
    setSearch(value)
    onUpdateQuerystring({ ...props.querystring, q: value, page: 1 })
  }

  // apply filters
  const [filters, setFilters, filteredItems] = useListFilters(
    textFilteredItems,
    props.listFilters,
    querystring.filters,
    isWholeDataSet
  )
  const handleFilter = filter => (e, { value }) => {
    setAllSelected(false)
    setPage(1)
    const copy = { ...filters }
    if (value === null) {
      delete copy[filter]
    } else {
      copy[filter] = value
    }
    setFilters(copy)
    onUpdateQuerystring({ ...props.querystring, filters: copy, page: 1 })
  }
  // sorting
  const [sort, setSort, sortedItems] = useSorting(
    filteredItems,
    props.querystring.sort,
    props.querystring.sort_direction,
    isWholeDataSet,
    props.forceJsSorting
  )
  const handleSort = ({ field, direction }) => {
    setSort({ field, direction })
    onUpdateQuerystring({ ...props.querystring, sort: field, sort_direction: direction })
  }

  // pagination
  const [page, setPage, items] = usePagination(sortedItems, querystring.page_size, querystring.page, isWholeDataSet)
  const handlePageChange = (e, { activePage }) => {
    setPage(activePage)
    onUpdateQuerystring({ ...props.querystring, page: activePage })
  }

  //  insert/edit/delete
  const withPermission = (perm, fn, hasItem) => arg => hasItem && perm(arg) ? fn(arg) : (!hasItem && perm ? fn() : null)
  const insertRecord = withPermission(props.canInsert, props.onInsert, false)
  const editRecord = withPermission(props.canEdit, props.onEdit, true)
  const deleteRecord = withPermission(props.canDelete, props.onDelete, true)

  // shortcuts
  const listFiltersLength = Object.keys(props.listFilters).length
  const listActionsLength = Object.keys(props.listActions).length

  // toolbar search input
  const searchFilter = () =>
    inDiv(
      <SearchFilter
        searchFields={props.searchFields}
        value={search}
        onChange={handleSearch}
      />
    )

  // toolbar list filters
  const listFilters = () => {
    return inDiv(
      Object.keys(props.listFilters).map(f => (
        <Select
          key={'filter-' + f}
          data-tour={`changelist-filter-${f}`}
          placeholder={t('Select') + ' ' + props.listFilters[f].label}
          options={props.listFilters[f].options}
          onChange={handleFilter(f)}
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
        data-tour='changelist-actions'
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
          props.listActions[value].options && props.listActions[value].options.setPage && setPage(props.listActions[value].options.setPage)
          setSelectedAction(null)
          setAllSelected(false)
          setSelectedItems([])
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
              data-tour='changelist-selection'
              onChange={(e, { checked }) => {
                setAllSelected(checked)
                setSelectedItems(
                  checked ? filteredItems.map(i => i[props.idProp]) : []
                )
              }}
            />
          </Table.HeaderCell>
        )}
        {props.listDisplay.map(field => {
          const sortable = props.sortableFields === null || props.sortableFields.indexOf(field) !== -1
          return (
            <Table.HeaderCell
              key={'th-' + field}
              onClick={() => {
                if (sortable) {
                  handleSort({
                    field,
                    direction: sort.direction === 'asc' ? 'desc' : 'asc'
                  })
                }
              }}
            >
              <div
                style={{
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: sortable ? 'pointer' : 'auto'
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
          )
        })}
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
    const actions = props.moreActions(item);
    ['edit', 'delete'].forEach(a => {
      if (!props.hideButtonWithoutPermissions || props['can' + _.upperFirst(a)](item)) {
        actions.push(
          <Icon
            title={props['can' + _.upperFirst(a)](item) ? a : null}
            name={a === 'edit' ? 'pencil' : 'trash'}
            circular
            color='blue'
            data-tour={`changelist-${a}`}
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

  const totItems = props.isWholeDataSet ? filteredItems.length : props.dataSetCount

  // finally...
  return (
    <div className='changelist' id='changelist' style={{ maxWidth: '100%', overflow: 'auto' }}>
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
              data-tour='changelist-add'
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
          <Table celled striped data-tour='changelist-table'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  colSpan={
                    props.listDisplay.length + 1 + (listActionsLength ? 1 : 0)
                  }
                >
                  {totItems}{' '}
                  {totItems === 1
                    ? props.verboseName
                    : props.verboseNamePlural}
                  {selectedItems.length
                    ? ' (' + selectedItems.length + ' ' + t(selectedItems.length > 1 ? 'selectedp' : 'selecteds') + ')'
                    : null}
                </Table.HeaderCell>
              </Table.Row>
              {header()}
            </Table.Header>
            <Table.Body>{items.map(item => row(item))}</Table.Body>
          </Table>
          <div style={{ maxWidth: '100%', overflow: 'auto' }} id='changelist-pagination-container'>
            <Pagination
              data-tour='changelist-pagination'
              activePage={page}
              onPageChange={handlePageChange}
              totalPages={Math.ceil(totItems / (querystring.page_size || 1))}
            />
          </div>
        </div>,
        props.isLoading
      )}
    </div>
  )
}

ChangeList.defaultProps = {
  listDisplay: [],
  canInsert: true,
  canEdit: item => true,
  canDelete: item => true,
  idProp: 'id',
  searchFields: [],
  listFilters: {},
  listActions: {},
  sortableFields: null,
  description: null,
  hideButtonWithoutPermissions: false,
  moreActions: item => [],
  toolbarButtons: null,
  isWholeDataSet: true,
  dataSetCount: null,
  onUpdateQuerystring: () => {},
  querystring: {},
  forceJsSorting: false
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
  fieldsMapping: PropTypes.object,
  verboseName: PropTypes.string.isRequired,
  verboseNamePlural: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  canInsert: PropTypes.bool,
  canEdit: PropTypes.func,
  canDelete: PropTypes.func,
  sortableFields: PropTypes.array,
  onInsert: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  hideButtonWithoutPermissions: PropTypes.bool,
  moreActions: PropTypes.func,
  toolbarButtons: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.array
  ]),
  isWholeDataSet: PropTypes.bool,
  dataSetCount: PropTypes.number,
  onUpdateQuerystring: PropTypes.func,
  querystring: PropTypes.object,
  forceJsSorting: PropTypes.bool
}

export default ChangeList
