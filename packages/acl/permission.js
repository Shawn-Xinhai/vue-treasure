import { getPath } from './utils'

let permissions = {}

export const setPermissions = newPermissions => {
  permissions = newPermissions
}

/**
 * Test a rule with a permission group
 * @param {Array|String} rules rule to test
 * @return {boolean} valided rule
 */
export const testPermission =(rules) => {
  rules = Array.isArray(rules) ? rules : [rules]
  return rules.every(rule => !!getPath(permissions, rule))
}
