// Iterables (可迭代对象)
/**
 * Iterable （可迭代对象）是数组的泛化。这个概念是说任何对象都可在 for..of 循环中使用。
 * 数组本身就是可迭代的。但不仅仅是数组。字符串也可以迭代，很多其他内建对象也都可以迭代。
 * 在核心 JavaScript 中，可迭代对象用途广泛。我们将会看到，很多内建的操作和方法都依赖于它。
 */

/**
 * 为了让对象可迭代，我们要给对象添加一个名为 Symbol.iterator 的方法。（一个特殊的内置标记）
 * 1️⃣当 for...of 循环开始，它将会调用这个方法（如果没找到会报错）。
 * 2️⃣这个方法必须返回一个迭代器 —— 一个有 next 方法的对象。
 * 3️⃣当 for...of 循环希望取得下一个数值，它就调用这个对象的 next() 方法。
 * 4️⃣next() 返回结果的格式必须是 {done: Boolean, value: any}，当 done=true 时，表示迭代结束，否则 value 必须是一个未被迭代的值。
 */

let rang = {
  from: 1,
  to: 5
}

rang[Symbol.iterator] = function() {
  return {
    current: this.from,
    last: this.to,
    next() {
      if (this.current <= this.last) {
        return { done: false, value: this.current++ }
      } else {
        return { done: true }
      }
    }
  }
}

// run
for (num of rang) {
  console.log(num)
}

// 应用，数组去重合并
function combine(...args) {
  let arr = [].concat.apply([], args)
  return Array.from(new Set(arr))
}

// test
console.log(combine([1, 2, 3], [2, 3, 4]))
