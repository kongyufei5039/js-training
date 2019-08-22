// 双层循环，兼容性好
var arr = [1, 1, '1', '1']
function unique(array) {
  // res用来存储结果
  var res = []
  for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
    for (var j = 0, resLen = res.length; j < resLen; j++) {
      if (array[i] === res[j]) {
        break
      }
    }
    if (j === res.length) {
      res.push(array[i])
    }
  }
  return res
}

console.log(unique(arr))

// indexOf 简化内部循环
function unique1(array) {
  var res = []
  for (var i = 0, len = array.length; i < len; i++) {
    var current = array[i]
    if (res.indexOf(current) === -1) {
      res.push(current)
    }
  }
  return res
}

console.log(unique1(arr))

// 先排序然后去重
function unique2(array, isSorted, iteratee) {
  var res = []
  var seen = ''
  for (var i = 0, len = array.length; i < len; i++) {
    if (isSorted) { // 已排序
      // 如果为第一个元素或者与上一个元素不同
      if (!i || seen !== array[i]) {
        res.push(array[i])
        seen = array[i]
      }
    } else {
      // 使用indexOf
      var current = array[i]
      if (res.indexOf(current) === -1) {
        res.push(current)
      }
    }
  }
  return res
}

console.log(unique2(arr))