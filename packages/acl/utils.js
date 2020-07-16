const BRACKET_RE_S = /\['([^']+)'\]/g
const BRACKET_RE_D = /\["([^"]+)"\]/g

/**
 * Normalize keypath with possible brackets into dot notations
 * @param {String} path path to be normalized, such as '[a][b]'
 * @return {String} normalized path, such as 'a.b'
 */
function normalizeKeypath(path) {
  return path.indexOf('[') < 0
    ? path
    : path.replace(BRACKET_RE_S, '.$1').replace(BRACKET_RE_D, '.$1')
}

/**

 * obj: '{ a: { b: 1 } }', path: 'a.b', return 1
 * @param {*} obj
 * @param {String} path
 * @return {*}
 */
export function getPath(obj, path) {
  path = normalizeKeypath(path)
  if (path.indexOf('.') < 0) {
    return obj[path]
  }
  path = path.split('.')
  let d = -1
  let l = path.length
  while (++d < l && obj != null) {
    obj = obj[path[d]]
  }
  return obj
}
