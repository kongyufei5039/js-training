// 一、Promise 链式调用常见错误
var doSomething = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(1)
      resolve(2)
    }, 1000)
  })
}

var doSomethingElse = function(result) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(result)
      resolve(3)
    }, 1000)
  })
}

var doThirdThing = function(newResult) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(newResult)
      resolve(newResult)
    }, 1000)
  })
}

var doFourThing = function() {
  setTimeout(`console.log(4)`, 1000)
}

// doSomething().then(function(result) {
//   doSomethingElse(result)
//     .then(newResult => doThirdThing(newResult))
// }).then(() => doFourThing())

/**
 * 错误分析
 * 1、没有正确将事务链接，产生了两条Promise链条：
 *  1️⃣doSomething -> doSomethingElse -> doThirdThing
 *  2️⃣doSomething -> doFourThing
 * 
 * 2、不必要的嵌套
 *  嵌套还限制了内部错误处理程序的范围，如果是非预期的，可能会导致未捕获的错误
 * 
 * 3、忘记catch终止链
 *  导致在大多数浏览器中不能终止的 Promise 链里的 rejection
 */

//  下面是修改后的代码
doSomething()
  .then(function(result) {
    return doSomethingElse(result)
  })
  .then(newResult => doThirdThing(newResult))
  .then(() => doFourThing())
  .catch(error => console.log(error))


  // catch 后续链式操作
  new Promise((resolve, reject) => {
    console.log('Initial')
    resolve()
  })
    .then(() => {
      throw new Error('something failed')
      console.log('Do this')
    })
    .catch(() => {
      console.log('Do that')
    })
    .then(() => {
      console.log('Do this whatever happened before')
    })


// 二、旧式回调 API 中创建 Promise
// * Promise通过它的构造器从头开始创建。 只应用在包裹旧的 API。
var saySomething = function(value) {
  throw new Error('throw error')
  console.log(value)
}
// setTimeout(() => saySomething('5 seconds passed'), 5000)

// 旧式 API 的问题在于无法捕获错误或异常

// 下面的代码用 Promise 来改善
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

wait(5000).then(() => saySomething('5 seconds passed')).catch(error => console.log(error))


// 三、组合
var asyncFunc1 = function() {
  return wait(6000).then(() => console.log(6))
}
var asyncFunc2 = function() {
  return wait(1000).then(() => console.log(7))
}
var func1 = function() {
  console.log(8)
}
var func2 = function() {
  console.log(9)
}

// 时序组合可以使用一些优雅的javascript形式
// ;[asyncFunc1, asyncFunc2].reduce((p, f) => p.then(f), Promise.resolve())

// 递归调用一个由异步函数组成的数组时相当于一个 Promise 链式
// Promise.resolve()
//   .then(asyncFunc1)
//   .then(asyncFunc2)

// 可复用的异步函数链式调用函数
let applyAsync = (acc, val) => acc.then(val)
let composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x))

let transformData = composeAsync(func1, asyncFunc1, asyncFunc2, func2)
// transformData()


// 在 ECMAScript 2017标准中, 时序组合可以通过使用async/await而变得更简单
;(async function() {
    for (let f of [func1, asyncFunc1, asyncFunc2, func2]) {
    await f();
  }
})()




// 四、时序
// 为了避免意外，即使是一个已经变成 resolve 状态的 Promise，传递给 then 的函数也总是会被异步调用
Promise.resolve().then(() => console.log(10))
console.log(11)

// 传递到then中的函数被置入一个微任务队列，而不是立即执行，这意味着它是在javascript所有事件队列的所有运行时结束了，
// 事件队列被清空后才执行
wait().then(() => console.log(16))
Promise.resolve().then(() => console.log(13)).then(() => console.log(14)).then(() => console.log(15))
console.log(12)
