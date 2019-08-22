// Promise 实现

// 1.Promise基本结构
const isFunction = variable => typeof variable === 'function'

// 2.Promise状态和值
/**
 * Pending(进行中)
 * Fullfilled(已成功)
 * Rejected(已失败)
 */
const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'


class MyPromise {
  constructor(handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter')
    }

    // 添加状态
    this._status = PENDING
    this._value = undefined

    // 添加成功回调函数队列
    this._fullfilledQueues = []
    // 添加失败回调函数队列
    this._rejectedQueue = []

    // 执行handle
    try {
      handle(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      this._reject(error)
    }
  }

  // 添加resolve执行的函数
  _resolve (val) {
    if (this._status !== PENDING) return
    // 依次执行成功队列中的函数，并清空队列
    const run = () => {
      this._status = FULLFILLED
      this._value = val
      let callback
      while (callback = this._fullfilledQueues.shift()) {
        callback(val)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(() => run(), 0)
  }

  // 添加reject执行的函数
  _reject (err) {
    if (this._status !== PENDING) return
    // 依次执行失败队列中的函数，并清空队列
    const run = () => {
      this._status = REJECTED
      this._value = err
      let callback;
      while (callback = this._rejectedQueue.shift()) {
        callback(err)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0)
  }

  // 完善then方法
  then (onFullfilled, onRejected) {
    const { _value, _status } = this
    return new MyPromise((onFullfilledNext, onRejectedNext) => {
      // 封装一个成功时的执行函数
      let fullfilled = value => {
        try {
          if (!isFunction(onFullfilled)) {
            // 如果fullfilled的回调不是一个函数，立即执行下一个then的回调
            onFullfilledNext(value)
          } else {
            let res = onFullfilled(value)
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后再执行下一个回调
              res.then(onFullfilledNext, onRejectedNext)
            } else {
              // 否则会将返回结果直接作为参数，传入下一个then回调函数，并立即执行下一个then的回调
              onFullfilledNext(res)
            }
          }
        } catch (error) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(error)
        }
      }

      // 封装一个失败时的执行函数
      let rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            // 如果rejected的回调不是一个函数，立即执行下一个then的回调
            onRejectedNext(error)
          } else {
            let res = onRejected(error)
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等到其状态改变后再执行下一个回调
              res.then(onFullfilledNext, onRejectedNext)
            } else {
              // 否则会将返回结果直接作为参数，传入下一个then回调函数，并立即执行下一个then的回调
              onFullfilledNext(res)
            }
          }
        } catch (error) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(error)
        }
      }

      switch (_status) {
        // 当状态为pending时，将then方法回调函数加入执行队列等待执行
        case PENDING:
          this._fullfilledQueues.push(fullfilled)
          this._rejectedQueue.push(rejected)
          break
        // 当状态改变时，立即执行对应的回调函数
        case FULLFILLED:
          fullfilled(_value)
          break
        case REJECTED:
          rejected(_value)
          break
      }
    })
  }

  // 添加catch方法
  catch (onRejected) {
    return this.then(undefined, onRejected)
  }

  // 添加静态resolve方法
  static resolve (value) {
    // 如果参数是MyPromise实例，直接返回这个实例
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  // 添加静态reject方法
  static reject (value) {
    return new MyPromise((resolve, reject) => reject(value))
  }

  // 添加静态all方法
  static all (list) {
    return new MyPromise((resolve, reject) => {
      /**
       * 返回值得集合
       */
      let values = []
      let count = 0
      for (let [i, p] of list.entries()) {
        // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
        this.resolve(p).then(res => {
          values[i] = res
          count++
          // 所有状态都变成fullfilled时返回的MyPromise状态就变成fullfilled
          if (count === list.length) resolve(values)
        }, error => {
          // 有一个被rejected是返回的MyPromise状态就变成rejected
          reject(error)
        })
      }
    })
  }

  // 添加静态race方法
  static race (list) {
    return new Myproject((resolve, reject) => {
      for (let p of list) {
        // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
        this.resolve(p).then(res => {
          resolve(res)
        }, error => {
          reject(error)
        })
      }
    })
  }

  // 添加finally方法
  finally (callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.reject(callback()).then(() => reason)
    )
  }
}
