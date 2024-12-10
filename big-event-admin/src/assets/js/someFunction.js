// 下面是一个函数进行随机数生成  第一个参数所需字符串长度   第二个参数需要生成的数量 这里只是复制进来的 改的话直接删除export就行了
export const getRandomUniqueIndexes = (max, count) => {
  const indexes = []
  while (indexes.length < count) {
    const randomIndex = Math.floor(Math.random() * max)
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex)
    }
  }
  return indexes
}
