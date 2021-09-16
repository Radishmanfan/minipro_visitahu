  // pages/content/viewintro.js

const app = getApp()
const db = wx.cloud.database()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: "",
    imgName: "",
    sitelatitude: null,
    sitelongitude: null,
    id: null,
    commentsDetail: null,
    openID: "",
    hascomment:true
  },
  openLocationtap: function() {
    var tarLatitude = Number(this.data.sitelatitude);
    var tarLongitude = Number(this.data.sitelongitude);
    var tarName = this.data.imgName;
    wx.openLocation({
      latitude: tarLatitude,
      longitude: tarLongitude,
      scale: 15,
      name: tarName
    })
  },
  showcomment: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'comment',
      data: {
        sitename: this.data.imgName
      },
      success: res => {
        if (res.result.judge) {
          var commentsTem = res.result.data.data;
          for (var i = 0; i < commentsTem.length; i++) {
            for (var j = 0; j < commentsTem[i].praiseUserID.length; j++) {
              if (commentsTem[i].praiseUserID[j] == that.data.openID) {
                commentsTem[i].hasPraise = true;
                break;
              }
              if (j == commentsTem[i].praiseUserID.length - 1) {
                commentsTem[i].hasPraise = false;
                break;
              }
            }
          }
          that.setData({
            hascomment: true,
            commentsDetail: commentsTem
          })
        } else {
          that.setData({
            hascomment: false 
          })
        }
        console.log('[云函数] [comment] 调用成功')
      },
      fail: err => {
        console.error('[云函数] [comment] 调用失败', err)
      }
    })
  },
  wrcomment: function() {
    wx.navigateTo({
      url: 'wrcomment?name=' + this.data.imgName
    })
  },
  praisetap: function(e) {
    console.log(e);
    var commentsid = e.currentTarget.dataset.commentsid;
    var praiseNum = e.currentTarget.dataset.praisecount;
    var praiseOpenid = e.currentTarget.dataset.praiseuser;
    var id = e.currentTarget.id;
    if (this.data.commentsDetail[id].hasPraise) //取消赞
    {
      var temp = this.data.commentsDetail;
      temp[id].hasPraise = false;
      --praiseNum;
      temp[id].praiseCount = praiseNum;
      this.setData({
        commentsDetail: temp
      })
      for (var i = 0; i < praiseOpenid.length; i++) {
        if (praiseOpenid[i] == this.data.openID) {
          praiseOpenid.splice(i, 1);
          break;
        }
      }
    } else { //赞一下
      var temp = this.data.commentsDetail;
      temp[id].hasPraise = true;
      ++praiseNum;
      temp[id].praiseCount = praiseNum;
      this.setData({
        commentsDetail: temp
      })
      praiseOpenid.unshift(this.data.openID);
    }
    wx.cloud.callFunction({
      name: 'change',
      data: {
        docid: commentsid,
        praiseNum: praiseNum,
        praiseUser: praiseOpenid
      },
      success: function(res) {
        console.log(res)
      },
      success: res => {
        console.log('[云函数] [change] 调用成功')
      },
      fail: err => {
        console.error('[云函数] [change] 调用失败', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      imgUrls: options.url,
      imgName: options.name,
      sitelatitude: options.latitude,
      sitelongitude: options.longitude,
      id: options.id,
      openID: app.globalData.openid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.showcomment();
  },

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

  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.showcomment();
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