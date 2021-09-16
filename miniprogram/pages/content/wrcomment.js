// pages/content/wrcomment.js
const app = getApp();
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    comment: ""
  },
  getNowDate: function() {
    var date = new Date();
    var sign1 = "-";
    var sign2 = ":";
    var year = date.getFullYear() // 年
    var month = date.getMonth() + 1; // 月
    var day = date.getDate(); // 日
    var hour = date.getHours(); // 时
    var minutes = date.getMinutes(); // 分
    var seconds = date.getSeconds() //秒
    var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
    var week = weekArr[date.getDay()-1];
    // 给一位数数据前面加 “0”
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds + " " + week;
    return currentdate;
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      app.globalData.userInfo = this.data.userInfo;
      app.globalData.hasUserInfo = true;
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
bindFormSubmit(e) {
    var that=this;
    var currentdate = this.getNowDate();
    var comment = e.detail.value.textarea;
     db.collection('counters').where({
      _id: "XIdX5eSiwXKAQrZD"
    }).get({
      success: res => {
        var commentsNum = res.data[0].count + 1;
        wx.cloud.callFunction({
          name: 'update',
          data: {
            commentsNumber: commentsNum,
          },
          success: res => {
            console.log('[云函数] [update] 调用成功')
          },
          fail: err => {
            console.error('[云函数] [update] 调用失败', err)
          }
        })
        db.collection('comments').add({
          data: {
            sitepoint: this.data.name,
            userInfo: app.globalData.userInfo,
            comment: comment,
            commentsID: commentsNum,
            praiseCount: 0,
            praiseUserID: [],
            time: currentdate,
            hasPraise: false
          },
          success: res => {
            wx.showToast({
              title: '留言成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
            setTimeout(function () {
              wx.navigateBack({
                url: "viewintro"
              })
            }, 1000);
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '留言失败，请联系开发者'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.hasUserInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        name: options.name
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})