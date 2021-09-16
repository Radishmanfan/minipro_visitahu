// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var commentsNum = event.commentsNumber
  try {
    return await db.collection('counters').doc('XIdX5eSiwXKAQrZD').update({
      data: {
        count: commentsNum
      }
    })
  } catch (e) {
    console.log(e)
  }
}