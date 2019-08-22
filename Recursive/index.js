// 递归调用实例

// 1.对数字求和到给定值
// 编写一个函数 sumTo(n) 计算 1 + 2 + ... + n 的和。
function sumTo(n) {
  return n === 1 ? 1 : n + sumTo(n - 1)
}

console.log(sumTo(10000))

// 2.计算阶乘
// 自然数的阶乘是指，一个数乘以 它减去 1，然后乘以 它减去 2，以此类推直到乘以 1。n 的阶乘被记作 n!。
function factorial(n) {
  return n === 1 ? 1 : n * factorial(n - 1)
}

console.log(factorial(5))

// 3.斐波那契数列
// Fn = Fn-1 + Fn-2
function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2)
}

console.log(fib(3))
// console.log(fib(40))

// 优化fib
// 自上而下的动态规划
function fib1(n) {
  let a = 1, b = 1
  for (let i = 3; i <= n; i++) {
    let c = a + b
    a = b
    b = c
  }
  return b
}

console.log(fib1(40))

// 4.输出一个单链表
const list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
}

function printList(list) {
  console.log(list.value)
  if(list.next) printList(list.next)
}

console.log("-------------- 输出一个单链表 --------------")
printList(list)

// 反向输出一个单链表

function printReverseList(list) {
  if (list.next) printReverseList(list.next)
  console.log(list.value)
}

console.log("--------------- 反向输出一个单链表 -------------")
printReverseList(list)
