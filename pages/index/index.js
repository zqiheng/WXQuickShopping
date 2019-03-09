//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    codeMsg: '',
    winHeight: 550
  },

  // 页面加载时
  onLoad: function() {
    var _this = this;
  },

  //点击扫描图片事件
  imageButton: function(e) {
    var _this = this;
    var preURL = app.globalData.preURL;

    if (app.globalData.shopInfo.id != null){
      //扫描API
      wx.scanCode({
        success: function (res) {
          _this.setData({
            codeMsg: res.result
          });

          // 根据扫描productID请求后台数据
          wx.request({
            url: preURL + '/product/get_one_product_info/req',
            method: "POST",
            data: {
              productID: res.result,
              shopObj: app.globalData.shopInfo.id,
            },
            // 成功
            success: function (data) {
              if (data.data.code === 0) {
                console.log("有商品信息，马上加载");
                if (res.result) {
                  wx.navigateTo({
                    url: '../details/details?productID=' + res.result,
                  })
                }
              } else {
                wx.showToast({
                  title: '暂无此商品信息',
                  duration: 1200,
                })
              }
            },
            fail: function () {
              wx.showToast({
                title: '加载信息失败',
                duration: 3000,
              })
            }
          })
        }
      })
    }
  }
})