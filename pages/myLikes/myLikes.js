var util = require("../../utils/util.js")
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myLike: [],
    winHeight: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    var _this = this;
    var height = app.globalData.windowHeight;
    var arr = wx.getStorageSync('myLike') || [];
    console.log("myLikes页面--收藏列表缓存数组：", arr);
    _this.setData({
      myLike: arr,
      winHeight: height
    })
  }
})