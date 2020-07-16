import { testPermission } from './permission'

/**
 * @param {Object} router router object from 'vue-router'
 * @param {String} notFound
 */
export const routerGuard = (router, notFound) => {
  router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.acl) {
      let rules = to.meta.acl
      if (!testPermission(rules)) {
        return next(notFound)
      }
    }
    next()
  })
}
