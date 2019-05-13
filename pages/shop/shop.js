var util = require("../../utils/util.js")
const app = getApp();

Page({
  data: {
    curNav: 'A', // 左侧点击类样式          
    // pickUpOnself: true,   // 表示用户选择自提
    shopInfo: null,
    distance: 0,
    list: null,
  },

  // 页面加载时渲染数据
  onLoad: function() {
    // var _this = this;
    // var preURL = app.globalData.preURL;
    // var pickUpOnself = app.globalData.pickUpOnself;
    // var shopInfo = app.globalData.shopInfo;

    // if (shopInfo != null) {
    //   // 加载此页面时提示信息
    //   wx.showLoading({
    //     title: '数据加载中...',
    //   })

    //   var distance = shopInfo.distance;
    //   if (distance > 0 && distance < 1) {
    //     _this.data.distance = distance.toFixed(2);
    //   } else if (distance >= 1 && distance < 10) {
    //     _this.data.distance = distance.toFixed(1);
    //   } else if (distance >= 10) {
    //     _this.data.distance = distance.toFixed(0);
    //   }

    //   _this.setData({
    //     shopInfo: shopInfo,
    //     distance: _this.data.distance,
    //     pickUpOnself: pickUpOnself, // 全局数据中取出用户打包方式
    //   })

    //   var shopObj = app.globalData.shopInfo.id;
    //   // 调用获取商品信息的方法
    //   util.getProductInfo(preURL, shopObj, function(result) {
    //     _this.setData({
    //       list: result,
    //     });
    //     wx.hideLoading();
    //   });
    // }

    // // 获取可视区高度
    // wx.getSystemInfo({
    //   success: function(res) {
    //     _this.setData({
    //       winHeight: res.windowHeight,
    //     })
    //   }
    // })
  },

  /**
   * 监听页面显示时事件
   */
  onShow: function() {
    var _this = this;
    var preURL = app.globalData.preURL;
    var pickUpOnself = app.globalData.pickUpOnself;
    var shopInfo = app.globalData.shopInfo;

    if (shopInfo != null) {
      // 加载此页面时提示信息
      wx.showLoading({
        title: '数据加载中...',
      })

      var distance = shopInfo.distance;
      if (distance > 0 && distance < 1) {
        _this.data.distance = distance.toFixed(2);
      } else if (distance >= 1 && distance < 10) {
        _this.data.distance = distance.toFixed(1);
      } else if (distance >= 10) {
        _this.data.distance = distance.toFixed(0);
      }

      _this.setData({
        shopInfo: shopInfo,
        distance: _this.data.distance,
        pickUpOnself: pickUpOnself, // 全局数据中取出用户打包方式
      })

      var shopObj = app.globalData.shopInfo.id;
      // 调用获取商品信息的方法
      util.getProductInfo(preURL, shopObj, function (result) {
        _this.setData({
          list: result,
        });
        wx.hideLoading();
      });
    }

    // 获取可视区高度
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winHeight: res.windowHeight,
        })
      }
    })
    // var _this = this;
    // var pickUpOnself = app.globalData.pickUpOnself;
    // var shopInfo = app.globalData.shopInfo;

    // if (shopInfo != null) {
    //   var distance = shopInfo.distance;
    //   if (distance > 0 && distance < 1) {
    //     _this.data.distance = distance.toFixed(2);
    //   } else if (distance >= 1 && distance < 10) {
    //     _this.data.distance = distance.toFixed(1);
    //   } else if (distance >= 10) {
    //     _this.data.distance = distance.toFixed(0);
    //   }

    //   _this.setData({
    //     shopInfo: shopInfo,
    //     distance: _this.data.distance,
    //     pickUpOnself: pickUpOnself, // 全局数据中取出用户打包方式
    //   })

    //   var preURL = app.globalData.preURL;
    //   var shopObj = app.globalData.shopInfo.id;

    //   // 如果商品列表为空，则在调用获取商品的方法
    //   if (_this.data.list == null) {
    //     util.getProductInfo(preURL, shopObj, function(result) {
    //       _this.setData({
    //         list: result,
    //       })
    //     });
    //   }
    // }
  },

  /**
   * 监听用户点击获取定位事件
   */
  getPosition: function(e) {
    var _this = this;
    var preURL = app.globalData.preURL;
    util.getPermission(function (res) {
      var longitude = res.longitude; //经度 
      var latitude = res.latitude; //维度 
      // 请求后台数据返回距离最近的商店
      util.findTheNearByShop(preURL, longitude, latitude, function (res) {
        var shop = res.data.body;
        if (res.data.code === 0) {
          app.globalData.shopInfo = shop;
          _this.setData({
            shopInfo: shop,
          })
          _this.onShow();
        }
      });
    });
  },

  /**
   * 用户点击 自提 / 外送 事件
   */
  pickUp: function(e) {
    var _this = this;
    app.globalData.pickUpOnself = !app.globalData.pickUpOnself;

    // 更新数据
    _this.setData({
      pickUpOnself: app.globalData.pickUpOnself,
    })
  },


  //点击左侧 tab ，右侧列表相应位置联动 置顶
  switchRightTab: function(e) {
    var _this = this;
    var id = e.target.id;
    _this.setData({
      // 动态把获取到的 id 传给 scrollTopId
      scrollTopId: id,
      // 左侧点击类样式
      curNav: id
    })
  }

})