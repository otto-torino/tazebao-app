import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import config from '../../Config'
import { withLoader } from '../../HOC/Loader'
import { varToVerbose } from '../../Utils/Strings'
import { Table, Pagination, Icon, Input, Button } from 'semantic-ui-react'
import styles from './ChangeList.module.css'

/**
 * ChangeList view, Django rulez
 * This is a Component which displays an admin list view in order to show current records
 * It provides controllers to add, change and delete items.
 */
class ChangeList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      searchFilter: '',
      sort: this.props.sort,
      sortDirection: this.props.sortDirection
    }
    this.handlePaginationChange = this.handlePaginationChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.insert = this.insert.bind(this)
    this.edit = this.edit.bind(this)
    this.delete = this.delete.bind(this)
  }

  header () {
    return (
      <Table.Row>
        {this.props.listDisplay.map(field => (
          <Table.HeaderCell
            key={'th-' + field}
            onClick={() =>
              this.setState({
                sort: field,
                sortDirection:
                  this.state.sort === field &&
                  this.state.sortDirection === 'asc'
                    ? 'desc'
                    : 'asc'
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
              {varToVerbose(field)}
              {this.state.sort === field && (
                <Icon
                  name={`angle ${
                    this.state.sortDirection === 'asc' ? 'up' : 'down'
                  }`}
                />
              )}
              {this.state.sort !== field && (
                <Icon name='angle up' style={{ color: '#fff' }} />
              )}
            </div>
          </Table.HeaderCell>
        ))}
        <Table.HeaderCell key='th-actions' style={{ whiteSpace: 'nowrap' }} />
      </Table.Row>
    )
  }

  row (item) {
    const cells = []
    this.props.listDisplay.forEach((field, idx) => {
      const collapsing = idx === 0
      const value = _.get(item, field)
      let valueString
      if (this.props.fieldsValue && this.props.fieldsValue[field]) {
        valueString = this.props.fieldsValue[field](value)
      } else {
        valueString = value
        if (typeof value === 'boolean') {
          valueString = value ? (
            <Icon name='thumbs up' color='green' />
          ) : (
            <Icon name='thumbs down' color='orange' />
          )
        }
      }
      cells.push(
        <Table.Cell collapsing={collapsing} key={'cell-' + idx}>
          {valueString}
        </Table.Cell>
      )
    })
    // actions
    cells.push(
      <Table.Cell collapsing key='cell-actions' textAlign='right'>
        <Icon
          name='pencil'
          circular
          color='blue'
          disabled={!this.props.canEdit(item)}
          onClick={this.edit(item)}
          key='edit-btn'
          style={{ cursor: this.props.canEdit(item) ? 'pointer' : 'default' }}
        />
        <Icon
          name='trash'
          circular
          color='blue'
          disabled={!this.props.canDelete(item)}
          onClick={this.delete(item)}
          key='delete-btn'
          style={{ cursor: this.props.canDelete(item) ? 'pointer' : 'default' }}
        />
      </Table.Cell>
    )
    return (
      <Table.Row key={item[this.props.idProp] || Math.random()}>
        {cells}
      </Table.Row>
    )
  }

  onSearch (e, { value }) {
    this.setState({ searchFilter: value })
  }

  handlePaginationChange (e, { activePage }) {
    this.setState({ page: activePage })
  }

  // called when clicking the add button
  insert () {
    if (this.props.canInsert) {
      this.props.onInsert()
    }
  }

  // called when clicking the edit icon
  edit (item) {
    return () => {
      if (this.props.canEdit(item)) {
        this.props.onEdit(item)
      }
    }
  }

  // called when clicking the delete icon
  delete (item) {
    return () => {
      if (this.props.canDelete(item)) {
        this.props.onDelete(item)
      }
    }
  }

  render () {
    // filter
    let filteredItems = this.props.items.slice()
    if (this.state.searchFilter) {
      const re = new RegExp(this.state.searchFilter, 'i')
      filteredItems = filteredItems.filter(item => {
        let show = false
        for (let i = 0, len = this.props.searchFields.length; i < len; i++) {
          const searchField = this.props.searchFields[i]
          if (re.test(_.get(item, searchField))) {
            show = true
            break
          }
        }
        return show
      })
    }

    // pagination
    const start = (this.state.page - 1) * config.ui.adminListPerPage
    const end = start + config.ui.adminListPerPage
    const items = filteredItems
      // apply sort before slicing ;P
      .sort((a, b) => {
        if (!this.state.sort) return -1
        const m = this.state.sortDirection === 'asc' ? 1 : -1
        return a[this.state.sort] < b[this.state.sort] ? -1 * m : 1 * m
      })
      .slice(start, end)

    return (
      <div>
        <div className={styles.changelistTools}>
          <Input
            icon='search'
            placeholder={
              'Search ' +
              this.props.searchFields.map(f => varToVerbose(f)).join(', ')
            }
            onChange={this.onSearch}
            style={{ width: '400px' }}
          />
          <Button
            disabled={!this.props.canInsert}
            color='blue'
            onClick={this.insert}
            icon
          >
            <Icon name='plus' /> Add {this.props.verboseName}
          </Button>
        </div>
        <div className={styles.tableResponsive}>
          {withLoader(
            <Table celled striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={this.props.listDisplay.length + 1}>
                    {filteredItems.length}{' '}
                    {filteredItems.length === 1
                      ? this.props.verboseName
                      : this.props.verboseNamePlural}
                    {' (' + this.props.tot + ' total)'}
                  </Table.HeaderCell>
                </Table.Row>
                {this.header()}
              </Table.Header>
              <Table.Body>{items.map(item => this.row(item))}</Table.Body>
            </Table>, this.props.isLoading
          )}

          <Pagination
            activePage={this.state.page}
            onPageChange={this.handlePaginationChange}
            totalPages={Math.ceil(
              filteredItems.length / config.ui.adminListPerPage
            )}
          />
        </div>
      </div>
    )
  }
}

ChangeList.propTypes = {
  verboseName: PropTypes.string.isRequired,
  verboseNamePlural: PropTypes.string.isRequired,
  items: PropTypes.array,
  listDisplay: PropTypes.array,
  searchFields: PropTypes.array,
  sort: PropTypes.string,
  sortDirection: PropTypes.string,
  canInsert: PropTypes.bool,
  canEdit: PropTypes.func.isRequired,
  canDelete: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  idProp: PropTypes.string.isRequired, // name of the property used as id
  isLoading: PropTypes.bool,
  tot: PropTypes.number,
  fieldsValue: PropTypes.object
}

export default ChangeList
