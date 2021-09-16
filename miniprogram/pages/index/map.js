// pages/index/map.js
const app = getApp()
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: null,
    mapHeight: null,
    latitude: 31.768000,
    longitude: 117.184700,
    scale: 15, //数字越小显示的地图越大
    // callout: {
    //   color: "#fff",
    //   borderWidth: 3,
    //   borderRadius: 50,
    //   padding: 20,
    //   bgColor: "#0af",
    //   borderColor: "#fff"
    // },
    section: [{
        place: '出入口',
        id: '1'
      },
      {
        place: '教学楼',
        id: '2'
      },
      {
        place: '学院楼',
        id: '3'
      },
      {
        place: '办公楼',
        id: '4'
      },
      {
        place: '运动场',
        id: '5'
      },
      {
        place: '餐厅',
        id: '6'
      },
      {
        place: '寝室',
        id: '7'
      },
      {
        place: '生活服务',
        id: '8'
      }
    ],
    currentID: undefined,
    currentPlace: undefined,
    number: undefined,
    markers: null,
    show: false
  },

  //事件处理函数
  navtap: function(e) {
    var that = this;
    var curID = parseInt(e.currentTarget.id);
    var curPlace = e.target.dataset.place;
    db.collection('location').where({
        array: curID
      })
      .get({
        success(res) {
          console.log("查询成功");
          var temp = res.data;
          var num = temp.length;
          temp = that.changecalloutstyle(temp, num);
          that.setData({
            currentID: curID,
            currentPlace: curPlace,
            number: num,
            markers: temp
          })
        }
      })
  },
  selfloctap: function() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 17
        })
      }
    })
  },
  bottomtap: function() {
    if (!this.data.show) {
      this.setData({
        mapHeight: this.data.windowHeight - 345,
        show: !this.data.show
      })
    } else {
      this.setData({
        mapHeight: this.data.windowHeight - 85,
        show: !this.data.show
      })
    }
  },
  callouttap: function(e) {
    var markerid = e.markerId;
    db.collection('location').where({
        id: markerid
      })
      .get({
        success(res) {
          console.log("查询成功");
          var sitename = res.data[0].sitepoint;
          var siteimagesrc = res.data[0].imagePath;
          var siteid = res.data[0].id;
          var sitelatitude = res.data[0].latitude;
          var sitelongitude = res.data[0].longitude;
          wx.navigateTo({
            url: '../content/viewintro?url=' + siteimagesrc + '&name=' + sitename + '&id=' + siteid + '&latitude=' + sitelatitude + '&longitude=' + sitelongitude
          })
        }
      })
  },
  gotoLocationtap: function(e) {
    var tarLatitude = e.target.dataset.latitude;
    var tarLongitude = e.target.dataset.longitude;
    var tarName = e.target.dataset.name;
    wx.openLocation({
      latitude: tarLatitude,
      longitude: tarLongitude,
      scale: 15,
      name: tarName
    })
  },
  introtap: function(e) {
    var sitelatitude = e.currentTarget.dataset.latitude;
    var sitelongitude = e.currentTarget.dataset.longitude;
    var sitename = e.currentTarget.dataset.name;
    var siteimagesrc = e.currentTarget.dataset.src;
    var siteid = e.currentTarget.id;
    wx.navigateTo({
      url: '../content/viewintro?url=' + siteimagesrc + '&name=' + sitename + '&id=' + siteid + '&latitude=' + sitelatitude + '&longitude=' + sitelongitude
    })
  },
  //用于更改callout样式
  changecalloutstyle: function (temp, num) {
    for (var j = 0; j < num; j++) {
      temp[j].callout.color = "#00f";
      temp[j].callout.padding = 18;
      temp[j].callout.fontSize= 15;
      temp[j].callout.borderWidth=3;
      temp[j].callout.borderRadius=20;
      temp[j].callout.bgColor="#0af";
      temp[j].callout.borderColor="#fff";
    }
    return temp;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: res => {
        that.setData({
          windowHeight: res.windowHeight,
          mapHeight: res.windowHeight - 85
        })
      }
    })
    var curID = 1;
    var curPlace = "出入口";
    db.collection('location').where({
        array: curID
      })
      .get({
        success(res) {
          console.log("查询成功");
          var temp = res.data;
          var num = temp.length;
          temp=that.changecalloutstyle(temp,num);
          that.setData({
            currentID: curID,
            currentPlace: curPlace,
            number: num,
            markers: temp
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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