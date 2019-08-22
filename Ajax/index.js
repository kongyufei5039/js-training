// 手动实现一个Ajax

var xhr

// 实例化一个 XMLHttpRequest 对象
if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest()
} else if (window.ActiveXObject) { // IE6 及以下
  xhr = new ActiveXObject('Microsoft.XMLHTTP')
}

// 绑定 xhr.readyState 改变时调用的回调
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(JSON.parse(xhr.responseText))
      console.log('请求成功')
    } else {
      console.log('请求失败')
    }
  }
}

// 初始化请求
xhr.open('GET', 'http://localhost:8080/a')

// 请求头设置（可选）
xhr.setRequestHeader('Accept', '*/*')

// 发送请求
xhr.send()

// 使用 fetch
fetch('http://localhost:8080/a', 
  {
    body: JSON.stringify({"answer": 42}),
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer'
  })
  .then(function(response) {
    return response.json()
  }).then(function(myjson) {
    console.log(myjson)
  })
