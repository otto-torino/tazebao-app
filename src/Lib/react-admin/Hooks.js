import { useState } from 'react'
import _ from 'lodash'

// hook used to slice a set of data
export const usePagination = (items, listPerPage) => {
  const [page, setPage] = useState(1)
  let paginatedItems = [...items]

  const start = (page - 1) * listPerPage
  const end = start + listPerPage

  paginatedItems = paginatedItems.slice(start, end)

  return [page, setPage, paginatedItems]
}

// hook used to sort a set of data (one field sorting)
export const useSorting = (items, initSortField, initSortDir) => {
  const [sort, setSort] = useState({
    field: initSortField,
    direction: initSortDir
  })
  const sortedItems = [...items].sort((a, b) => {
    if (!sort.field) return -1
    const m = sort.direction === 'asc' ? 1 : -1
    return a[sort.field] < b[sort.field] ? -1 * m : 1 * m
  })

  return [sort, setSort, sortedItems]
}

// hook used to perform a full-text search
export const useFullTextSearch = (items, fields, initSearch) => {
  const [search, setSearch] = useState('')
  const re = new RegExp(search, 'i')
  const filteredItems = [...items].filter(item => {
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

  return [search, setSearch, filteredItems]
}

export const useListFilters = (items, listFilters) => {
  const [filters, setFilters] = useState({}) // stores filters values in a dict field: value
  const filtersKeys = Object.keys(filters)

  const filteredItems = [...items].filter(item => {
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

  return [filters, setFilters, filteredItems]
}
