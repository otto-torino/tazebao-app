import { useState } from 'react'
import _ from 'lodash'

// hook used to slice a set of data
export const usePagination = (items, listPerPage, initPage = 1, isWholeDataSet = true) => {
  const [page, setPage] = useState(initPage)
  let paginatedItems = [...items]

  if (isWholeDataSet) {
    const start = (page - 1) * listPerPage
    const end = start + listPerPage

    paginatedItems = paginatedItems.slice(start, end)
  }

  return [page, setPage, paginatedItems]
}

// hook used to sort a set of data (one field sorting)
export const useSorting = (items, initSortField, initSortDir, isWholeDataSet = true) => {
  const [sort, setSort] = useState({
    field: initSortField,
    direction: initSortDir
  })
  let sortedItems = items

  if (isWholeDataSet) {
    sortedItems = [...items].sort((a, b) => {
      if (!sort.field) return -1
      const m = sort.direction === 'asc' ? 1 : -1
      if (typeof a[sort.field] === 'string' && typeof b[sort.field] === 'string') {
        return a[sort.field].toLowerCase().localeCompare(b[sort.field].toLowerCase()) * m
      } else {
        return a[sort.field] < b[sort.field] ? -1 * m : 1 * m
      }
    })
  }

  return [sort, setSort, sortedItems]
}

// hook used to perform a full-text search
export const useFullTextSearch = (items, fields, initSearch, isWholeDataSet) => {
  const [search, setSearch] = useState(initSearch)
  let filteredItems = items
  if (isWholeDataSet) {
    const re = new RegExp(search, 'i')
    filteredItems = [...items].filter(item => {
      if (!search) {
        return true
      }
      for (let i = 0, len = fields.length; i < len; i++) {
        if (re.test(_.get(item, fields[i]))) {
          return true
        }
      }
      return false
    })
  }

  return [search, setSearch, filteredItems]
}

export const useListFilters = (items, listFilters, initFilters, isWholeDataSet) => {
  const [filters, setFilters] = useState(initFilters || {}) // stores filters values in a dict field: value
  let filteredItems = items
  if (isWholeDataSet) {
    const filtersKeys = Object.keys(filters)

    filteredItems = [...items].filter(item => {
      let remove = false
      filtersKeys.forEach(f => {
        if (
          filters[f] !== undefined &&
          !listFilters[f].filter(item, filters[f])
        ) {
          remove = true
        }
      })
      return !remove
    })
  }

  return [filters, setFilters, filteredItems]
}
