//index.js
const app = getApp()

Page({
  data: {
  },
  //事件处理函数
  bindVisitAHUTap: function () {
    wx.navigateTo({
      url: 'map'
    })
  },
  bindIntroAHUtap: function () {
    wx.navigateTo({
      url: 'intro'
    })
  },
  onLoad: function (options) {
  },
  onShow:function(){
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})

