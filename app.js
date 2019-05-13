var util = require("/utils/util.js")


App({
  globalData: {
    userInfo: null, // 用户信息
    preURL: "http://zqiheng.e1.luyouxia.net:30795", // 后台接口请求地址
    shopInfo: null, // 加载首页时，默认选择距离用户最近的商店
    pickUpOnself: true, // 默认用户选择自提
    clearCarts: true, // 是否清除购物车，默认清除
    windowWidth: null, // 用户手机宽度
    windowHeight: null, // 用户手机高度
    isImmediatelyBuy: false, // 标志是否立即购买【true：表示立即购买false:表示加入购物车】
  },

  onLaunch: function() {
    var _this = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        _this.globalData.windowWidth = res.windowWidth;
        _this.globalData.windowHeight = res.windowHeight - 80;
      }
    });
  },
})