import { camelCaseToUnderscore, joinArray } from './util'

const defaultOptions = {
  searchParam: 'search',
  pageParam: 'page',
  timeFrom: 'fromDate',
  timeTo: 'toDate',
  debounceInterval: 600
}

export const genQueryCollector = (options = defaultOptions) => {
  const {
    searchParam,
    pageParam,
    timeFrom,
    timeTo,
    debounceInterval } = options
  return {
    methods: {
      aslUpdateQuery(query) {
        this._aslMergeQuery(query)
      },
      aslUpdateSearch(keyword, debounce) {
        if (this.asl.timer) {
          clearTimeout(this.asl.timer)
          this.asl.timer = null
        }
        const action = () => {
          const searchQuery = { [searchParam]: keyword }
          this._aslMergeQuery(searchQuery)
          this._aslResetPage()
        }
        if (debounce) {
          this.asl.timer = setTimeout(action, debounceInterval)
        } else {
          action()
        }
      },
      aslUpdateSort({ order, prop }) {
        if (order) {
          const ordering = `${order === 'descending' ? '-' : ''}${camelCaseToUnderscore(prop)}`
          this._aslMergeQuery({ ordering })
        } else {
          this._aslDeleteKeyFromQuery('ordering')
        }
      },
      aslUpdateFilter(filters) {
        const filterQuery = {}
        Object.keys(filters).forEach(key => {
          if (filters[key] && filters[key].length > 0) {
            filterQuery[key] = joinArray(filters[key], ',')
          } else {
            this._aslDeleteKeyFromQuery(key)
          }
        })
        this._aslMergeQuery(filterQuery)
        this._aslResetPage()
      },
      aslUpdateTimeRange(timeRange, fromKey = timeFrom, toKey = timeTo) {
        if (!timeRange || timeRange.length < 2) {
          this._aslDeleteKeyFromQuery(fromKey)
          this._aslDeleteKeyFromQuery(toKey)
        } else {
          const [fromDate, toDate] = timeRange
          this._aslMergeQuery({ [fromKey]: fromDate, [toKey]: toDate })
        }
        this._aslResetPage()
      },
      _aslResetPage() {
        if (this.asl.query && this.asl.query[pageParam]) {
          this.asl.query[pageParam] = 1
        }
      },
      _aslMergeQuery(newQuery) {
        this.asl.query = Object.assign({}, this.asl.query, newQuery)
      },
      _aslDeleteKeyFromQuery(queryName) {
        const newQuery = {}
        Object.keys(this.asl.query).filter(key => key !== queryName).forEach(key => {
          newQuery[key] = this.asl.query[key]
        })
        this.asl.query = newQuery
      }
    }
  }
}
