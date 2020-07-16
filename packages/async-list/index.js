import { genAsyncList } from './AsyncList'
import { genQueryCollector } from './QueryCollector'

export const AslPlugin = (_Vue, { fetcher, queryOptions }) => {
  _Vue.mixin(
    genAsyncList(fetcher)
  )
  _Vue.mixin(
    genQueryCollector(queryOptions)
  )
}
