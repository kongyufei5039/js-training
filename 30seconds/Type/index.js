// getType
const getType = v => v === undefined ? 'undefined' : v === null ? 'null' : v.constructor.name.toLowerCase()

// examples
console.log(getType(1)) // number
console.log(getType(new Set([1, 2]))) // set

// is
const is = (type, val) => ![, null].includes(val) && val.constructor === type

// examples
console.log(is(Array, [1])) // true

// isArrayLike
const isArrayLike = obj => obj !== null && typeof obj[Symbol.iterator] === 'function'

// examples
console.log(isArrayLike('abc')) // true
console.log(isArrayLike([1, 2])) // true
console.log(isArrayLike(document.querySelectorAll('wrapper'))) // true

// isBoolean
const isBoolean = val => typeof val === 'boolean'

// examples
console.log(isBoolean(1)) // false
console.log(isBoolean(true)) // true

// isEmpty
const isEmpty = val => val === null || !(Object.keys(val) || val).length

// examples
console.log(isEmpty([])) // true
console.log(isEmpty({})) // true
console.log(isEmpty('')) // true
console.log(isEmpty([1, 2])) // false

// isFunction
const isFunction = val => typeof val === 'function'

// example
console.log(isFunction('x')) //false
console.log(isFunction(x => x)) // true

// isNil
const isNil = val => val === undefined || val === null

// examples
console.log(isNil(null)) // true
console.log(isNil()) // true
console.log(isNil(1)) // false

// isNull
const isNull = val => val === null

// examples
console.log(isNull(null)) // true
console.log(isNull()) // false

// isNumber
const isNumber = val => typeof val === 'number' && val === val

// examples
console.log(isNumber(1)) // true
console.log(isNumber('1')) // false
console.log(isNumber(NaN)) // false

// isObject
const isObject = obj => obj === Object(obj)

// examples
console.log(isObject(Number(1))) // false
console.log(isObject({})) // true
console.log(isObject([])) // true
console.log(isObject(null)) // false
console.log(isObject(undefined)) // false
console.log(isObject(x => x)) // true
console.log(isObject(new Set())) // true

// isObjectLike
const isObjectLike = obj => obj !== null && typeof obj === 'object'

// examples
console.log(isObjectLike({})) // true
console.log(isObjectLike([])) // true
console.log(isObjectLike(new Set())) // true
console.log(isObjectLike(x => x )) // false
console.log(isObjectLike(null)) // false
console.log(isObjectLike(Number(1))) // false

// isPlainObject
const isPlainObject = val => !!val && typeof val === 'object' && val.constructor === Object

// examples
console.log(isPlainObject({})) // true
console.log(isPlainObject(new Map())) // false
console.log(isPlainObject(null)) // false
console.log(isPlainObject(x => x)) // false

// isPrimitive
const isPrimitive = val => Object(val) !== val

// examples
console.log(isPrimitive(null)) // true
console.log(isPrimitive()) // true
console.log(isPrimitive(Number(1))) // true
console.log(isPrimitive('')) // true
console.log(isPrimitive(Symbol())) // true
console.log(isPrimitive([])) // false

// isPromiseLike
const isPromiseLike = obj => obj !== null && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'

// examples
console.log(isPromiseLike({then: x => x})) // true
console.log(isPromiseLike({})) // false
console.log(isPromiseLike(null)) // false

// isString
const isString = val => typeof val === 'string'

// examples
console.log(isString('10')) // true

// isSymbol
const isSymbol = val => typeof val === 'symbol'

// examples
console.log(isSymbol(Symbol('x'))) // true

// isUndefined
const isUndefined = val => val === undefined

// examples
console.log(isUndefined(undefined)) // true

// isValidJSON
const isValidJSON = str => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

// examples
console.log(isValidJSON('{"a": "1", "b": "2"}')) // true
console.log(isValidJSON('{a: 1, b: "b"}')) // false
console.log(isValidJSON(null)) // true