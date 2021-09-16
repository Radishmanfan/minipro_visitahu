// 云函数入口文件

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100

exports.main = async(event, context) => {
  var sitename = event.sitename;
  // 先取出集合记录总数
  const countResult = await db.collection('comments').where({
    sitepoint: sitename
  }).count()
  const total = countResult.total
  if (total > 0) {
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = [];
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('comments').where({
        sitepoint: sitename
      }).orderBy('commentsID', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    return {
      data: (await Promise.all(tasks)).reduce((acc, cur) => ({
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      })),
      judge: true
    }
  } else {
    return {
      judge: false
    }
  }
}