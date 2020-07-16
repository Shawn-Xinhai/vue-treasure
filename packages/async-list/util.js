export const camelCaseToUnderscore = (camelCaseName) => {
  return camelCaseName.replace(/(?:^|\.?)([A-Z])/g, (_, y) => { return '_' + y.toLowerCase() }).replace(/^_/, '')
}

export const joinArray = (arr, seperator) => {
  if (!Array.isArray(arr)) throw new TypeError('joinArray only accept Array')
  return arr.join(seperator)
}
