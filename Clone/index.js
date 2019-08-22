// 一、浅拷贝
// 1、Object.assign()
var obj = { a: 'a', b: { c: 'c' } }
cloneObj = Object.assign({}, obj)
cloneObj.b.c = 'd'
console.log(obj, cloneObj)

// 2、Array.concat()
var arr = [1, 2, { a: 'a'}]
var cloneArr = arr.concat()
cloneArr[2].a = 'b'
console.log(arr, cloneArr)

// 3、扩展运算符（spread）
var arr1 = [3, 4, { b: 'b' }]
var cloneArr1 = [...arr1]
cloneArr1[2].b = 'c'
console.log(arr1, cloneArr1)

//4、Array.slice()
var arr2 = [5, 6, { c: 'c' }]
var cloneArr2 = arr2.slice()
cloneArr2[2].c = 'd'
console.log(arr2, cloneArr2)

// 二、深拷贝
// 1、JSON.parse(JSON.stringify())
// 原理：用JSON.stringify将对象转成JSON字符串，再用JSON.parse()把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。
// 缺点：这种方法虽然可以实现数组或对象深拷贝,但不能处理函数
let arr3 = [1, 'a', { b: 'b' }, function(){}]
var cloneArr3 = JSON.parse(JSON.stringify(arr3))
cloneArr3[2].b = 'c'
console.log(arr3, cloneArr3)

// 2、手写递归
// 原理：遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝

// 定义监测数据类型的函数
function checkType(target) {
  return Object.prototype.toString.call(target).slice(8, -1)
}

// 实现深度克隆
function clone(target) {
  // 判断target数据类型
  // 声明存储clone后的数据变量
  let result,
    targetType = checkType(target)
  if (targetType === 'Object') {
    result = {}
  } else if (targetType === 'Array') {
    result = []
  } else {
    // 如果不是Object或Array，直接返回
    return result
  }
  // 遍历target
  for (let i in target) {
    // 判断是否是对象自身属性
    if (target.hasOwnProperty(i)) {
      const value = target[i]
      if (checkType(value) === 'Object' || checkType(value) === 'Array') {
        // 递归
        result[i] = clone(value)
      } else {
        // value为基本数据类型或者函数
        result[i] = value
      }
    }
  }
  return result
}

// 测试1
var objOrigin = { a: 1, b: 'b', c: { d: 'd', e: 'e', f: 'f' }, e: [2, '3', { g: 'g' }] }
var objClone = clone(objOrigin)
objClone.b = 'c'
objClone.c.d = 'g'
objClone.e[2].g = 'h'
console.log(objOrigin, objClone)

// 测试2
// 测试是可以复制继承的属性
function ConstructObj(target) {
  this.origin = target
}
ConstructObj.prototype = objOrigin
ConstructObj.prototype.constructor = ConstructObj
var objNew = new ConstructObj('origin')
var objNewClone = clone(objNew)
console.log(objNew, objNewClone)
