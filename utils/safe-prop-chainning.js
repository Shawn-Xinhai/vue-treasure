// const x = { a: 'something' }, "x.a.b" 会抛出错误
// const safeX = safePropChainning(x); "safeX.a.b.safeNull" 会返回undefined
// safeX.a 会返回一个Proxy对象，safeX.a.safeNull才会返回对象的值
// 取值需要以 ".safeNull"结尾, 否则会返回一个Proxy对象
const safePropChainning = (value) => {
  const endMark = 'safeNull'
  return new Proxy({ value }, {
      get: function(target, prop) {
      const realVal = target.value
      if (prop === endMark) return realVal
      const valToPass = realVal ? realVal[prop] : valToPass
      return safePropChainning(valToPass)
      }
  })
}

export default safePropChainning
