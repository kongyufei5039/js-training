// 一、异步操作模式

// 1、回调函数
function f1(callback) {
  // ...
  callback()
}

function f2() {
  // ...
}

f1(f2)
// 优点：简单、容易理解和实现
// 缺点：不利于代码阅读和维护，各部分耦合度高，使得程序混乱、流程难以追踪，而且每个任务只能指定一个回调函数。


// 2、事件监听
// jQuery写法
// f1.on('done', f2)

function f1() {
  setTimeout(function () {
    // ...
    // f1.trigger('done')
  }, 1000)
}
// 优点：容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，可以去耦合实现模块化。
// 缺点：整个程序变成事件驱动型，运行流程不清晰。

// 3、发布/订阅（观察者模式）
// jQuery.subscribe('done', f2)

function f1() {
  setTimeout(function () {
    // jQuery.publish('done')
  }, 1000)
}

// f2执行完可以取消订阅
// jQuery.unsubscrible('done', f2)

// 这种方式的性质与事件监听类似，但明显优于后者。因为可以通过查看消息中心，了解存在多少信号，每个信号有多少订阅者，从而监控程序运行。


// 二、异步操作流程控制
function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果')
  setTimeout(function () { callback(arg * 2) }, 1000)
}

function final(value) {
  console.log('完成：', value)
}

async(1, function (value) {
  async(2, function (value) {
    async(3, function(value) {
      async(4, function(value) {
        async(5, function(value) {
          async(6, final)
        })
      })
    })
  })
})
// 上面的六个回调函数嵌套，不仅写起来麻烦，而且难以维护。

// 1、串行执行
// 编写流程控制函数，控制异步任务，一个任务完成，再执行另一个任务。
var items = [1, 2, 3, 4, 5, 6]
var results = []

function series(item) {
  if (item) {
    async(item, function(value) {
      results.push(value)
      return series(items.shift())
    })
  } else {
    return final(results[results.length - 1])
  }
}

series(items.shift())
// 缺点太耗时

// 并行执行
// 所有异步任务同时执行，等全部完成后执行final函数。
var _items = [1, 2, 3, 4, 5, 6]
var _results = []
_items.forEach(function (item) {
  async(item, function (value) {
    _results.push(value)
    if (_results.length === _items.length) {
      final(_results[_results.length - 1])
    }
  })
})

// 优点：执行效率高。
// 缺点：如果任务较多，很容易耗尽系统资源。

// 并行与串行结合
var _items_ = [1, 2, 3, 4, 5, 6]
var _results_ = []
var running = 0
var limit = 2

function launcher() {
  while(running < limit && _items_.length > 0) {
    var item = _items_.shift()
    async(item, function (value) {
      _results_.push(value)
      running--
      if (_items_.length > 0) {
        launcher()
      } else if (running === 0) {
        final(_results_[_results_.length - 1])
      }
    })
    running++
  }
}

launcher()

var div = document.getElementsByTagName('div')[0];

