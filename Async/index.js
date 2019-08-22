// Async 用法

// 1、先写一个例子
// 指定多少毫秒后输出一个值
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function asyncPrint(value, ms) {
  await timeout(ms)
  console.log(value)
}

asyncPrint('hello world', 1000)

// 由于 async 函数返回的是 Promise 对象，可以作为 await 命令的参数。所以改写上面的例子。
async function asyncTimeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function asyncPrint1(value, ms) {
  await asyncTimeout(ms)
  console.log(value)
}

asyncPrint1('hello world ~~', 2000)

// async 函数的多种使用形式
// 函数声明
async function foo() {}

// 函数表达式
const foo1 = async function() {}

// 对象的方法
let obj = { async foo2() {} }
obj.foo2().then()

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars')
  }

  async getAvatar(name) {
    const cache = await this.cachePromise
    return cache.match(`/avatars/${name}.jpg`)
  }
}

const storage = new Storage()
storage.getAvatar('jake').then()

// 箭头函数
const foo3 = async () => {}



// 2、语法
// async 函数返回一个Promise对象
async function f() {
  return 'I am primitive value'
}
f().then(v => console.log(v))

// async 内部抛出错误，会导致返回的 Promise 对象变为 reject 状态。抛出的错误对象会被 catch 方法回调函数接收到。
async function asyncError() {
  throw new Error('出错了')
}

asyncError().then(
  v => console.log(v)
  // ,e => console.log(e)
).catch(
  e => console.log(e)
)

// Promise 对象的状态变化
// async 函数返回的 Promise 对象，必须等到内部所有 await 命令后面的 Promise 对象执行完，才会发生改变。
async function print123() {
  await new Promise(resolve => {
    setTimeout(() => {
      console.log(1)
      resolve()
    }, 1000)
  })
  await new Promise(resolve => {
    setTimeout(() => {
      console.log(2)
      resolve()
    }, 1000)
  })
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(3)
      resolve(4)
    }, 1000)
  })
}
print123().then(v => console.log(v))

// await 命令
// 正常情况下，await 命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。
async function f1() {
  // 等同于 return 123
  return await 123
}

f1().then(v => console.log(v))

// 另一种情况是，await命令后面是一个thenable对象（即定义then方法的对象），那么await会将其等同于 Promise 对象。

// 错误处理
// 如果 await 后面的异步操作出错，那么等同于 async 函数返回的 Promise 对象被 reject。
async function f2() {
  await new Promise(function (resolve, reject) {
    throw new Error('出错了')
  })
}

f2()
.then(v => console.log(v))
.catch(e => console.log(e))

// 防止出错的方法，将其放在try...catch代码块中
async function f3() {
  try {
    await new Promise(function (resolve, reject) {
      throw new Error('出错了')
    })   
  } catch (error) {
  }
  return await('防止出错')
}

f3()
.then(v => console.log(v))
.catch(e => console.log(e))


// 使用注意点
// 1️⃣await 命令后面的 Promise 对象，运行结果可能是 rejected，会中断代码执行，所以最好把 await 命令放在 try...catch 代码块中。
async function myFunction() {
  await Promise.resolve(11)
  await Promise.reject(22)
  await Promise.resolve(33)
}

myFunction()
.then(v => console.log(v))
.catch(e => console.log(e))

async function myFunction1() {
  try {
    await Promise.resolve(11)
    await Promise.reject(22)
  } catch (error) {
  }
  return await Promise.resolve(33)
}
myFunction1()
.then(v => console.log(v))
.catch(e => console.log(e))

// 2️⃣多个 await 命令后面的一步操作，如果不存在继发关系，最好让他们同时出发。
// 下面这个例子是继发
function getFoo() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(new Date())
    }, 1000)
  })
}

function getBar() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(new Date())
    }, 1000)
  })
}

(async function() {
  let myFoo = await getFoo()
  let myBar = await getBar()
  console.log(myFoo)
  console.log(myBar)
})()

// 写法一
;(async function() {
  let [myFoo, myBar] = await Promise.all([getFoo(), getBar()])
  console.log(myFoo)
  console.log(myBar)
})()

// 写法二
;(async function() {
  let fooPromise = getFoo()
  let barPromise = getBar()
  let myFoo = await fooPromise
  let myBar = await barPromise
  console.log(myFoo)
  console.log(myBar)
})()

// 3️⃣await 命令只能在 async 函数中使用，如果在普通函数中就会报错。
async function dbFuc(db) {
  let docs = [{}, {}, {}]

  // 报错
  docs.forEach(function (doc) {
    // await db.post(doc)
  });
}

// 正确的写法使用for循环
async function dbFuc(db) {
  let docs = [{}, {}, {}]

  for (let doc of docs) {
    await db.post(doc)
  }
}

// 4️⃣async 函数可以保留运行堆栈
const a = async () => {
  await b()
  c()
}
// 上面代码中，b()运行的时候，a()是暂停执行，上下文环境都保存着。一旦b()或c()报错，错误堆栈将包括a()。



// 3、async 函数的实现原理
// async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return apawn(function* (){
    // ...
  })
}

// apawn 就是自动执行器

