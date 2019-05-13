var util = require("../../utils/util.js")
const app = getApp()

Page({
  data: {
    codeMsg: '',
    winHeight: 580,
    address: null,
  },

  // 页面加载时
  onLoad: function() {
    var _this = this;
    var preURL = app.globalData.preURL;

    _this.setData({
      // winHeight: app.globalData.windowHeight,      
    })

    util.getPermission(function (res) {
      console.log(res);
      var longitude = res.longitude; //经度 
      var latitude = res.latitude; //维度 
      // 请求后台数据返回距离最近的商店
      util.findTheNearByShop(preURL, longitude, latitude, function (res) {
        var shop = res.data.body;
        if (res.data.code === 0) {
          app.globalData.shopInfo = shop;
          console.log(app.globalData.shopInfo);
        }
      });
    });
  },

  onShow: function(){
    if(app.globalData.shopInfo === null){
      util.getPermission(function (res) {
        var longitude = res.longitude; //经度 
        var latitude = res.latitude; //维度 
        // 请求后台数据返回距离最近的商店
        var preURL = app.globalData.preURL;
        util.findTheNearByShop(preURL, longitude, latitude, function (res) {
          var shop = res.data.body;
          if (res.data.code === 0) {
            app.globalData.shopInfo = shop;
          }
        });
      });
    }
  },

  //点击扫描图片事件
  imageButton: function(e) {
    var _this = this;
    var preURL = app.globalData.preURL;

    if (app.globalData.shopInfo != null){
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
                console.log("商品信息加载中.......");
                if (res.result) {
                  wx.navigateTo({
                    url: '../details/details?productID=' + res.result,
                  })
                }
              } else {
                wx.showToast({
                  title: '暂无此商品信息',
                  duration: 1500,
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