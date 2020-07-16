import { directive } from './directive'
import { setPermissions, testPermission } from './permission'
import { routerGuard } from './router-guard'

const DIRECTIVE_NAME = 'acl'

const AclPlugin = (_Vue, options) => {
  // If router is passed in, add router guard
  if (options && options.router) {
    const { router, notFound } = options
    routerGuard(router, notFound)
  }

  // Add 'acl' global directive
  _Vue.directive(DIRECTIVE_NAME, directive)

  // Add access to acl object for use in component
  _Vue.prototype.$acl =  {
    /**
     * @param {Array|String} rules
     */
    check(rules) {
      return testPermission(rules)
    }
  }
}

const Acl = { setPermissions, testPermission }

export { Acl, AclPlugin }
