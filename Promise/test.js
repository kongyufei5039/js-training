function timeout(ms) {
  return new MyPromise((resolve, reject) => {
    setTimeout(resolve, ms, 'done')
  })
}

timeout(3000).then(value => {
  console.log(value)
})
