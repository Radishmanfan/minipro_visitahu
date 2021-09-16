// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var docid = event.docid;
  var praiseNum = event.praiseNum;
  var praiseUser=event.praiseUser;
    try {
      return await db.collection('comments').doc(docid).update({
        data: {
          praiseCount: praiseNum,
          praiseUserID:praiseUser
        }
      })
    } catch (e) {
      console.log(e)
    }
  }