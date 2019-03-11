// pages/shop/shop.js
const app = getApp();

Page({
  data: {
    // 左侧点击类样式
    curNav: 'A',
    // pickUpOnself: true,   // 表示用户选择自提
    shopInfo: null,
    distance: 0,
    list: null,
  },

  // 页面加载时渲染数据
  onLoad: function() {
    var _this = this;
    var preURL = app.globalData.preURL;
    var pickUpOnself = app.globalData.pickUpOnself;

    // 加载此页面时提示信息
    wx.showLoading({
      title: '数据加载中...',
    })

    var shopInfo = app.globalData.shopInfo;
    if (shopInfo != null) {
      var distance = shopInfo.distance;
      if (distance > 0 && distance < 1) {
        _this.data.distance = distance.toFixed(2);
      } else if (distance >= 1 && distance < 10) {
        _this.data.distance = distance.toFixed(1);
      } else if (distance >= 10) {
        _this.data.distance = distance.toFixed(0);
      }

      // 调用获取商品信息的方法
      _this.getProductInfo(function(result) {
        _this.setData({
          list: result,
          shopInfo: shopInfo,
          distance: _this.data.distance,
          pickUpOnself: pickUpOnself, // 全局数据中取出用户打包方式
        });
        wx.hideLoading();
      });
    } else {
      wx.hideLoading();
      wx.showToast({
        title: '稍后再试...',
      })
    }

    // 获取可视区高度
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          winHeight: res.windowHeight,
        })
      }
    })
  },

  /**
   * 监听页面显示时事件
   */
  onShow: function() {
    var _this = this;
    var pickUpOnself = app.globalData.pickUpOnself;
    var shopInfo = app.globalData.shopInfo;

    if (shopInfo != null) {
      var distance = shopInfo.distance;
      if (distance > 0 && distance < 1) {
        _this.data.distance = distance.toFixed(2);
      } else if (distance >= 1 && distance < 10) {
        _this.data.distance = distance.toFixed(1);
      } else if (distance >= 10) {
        _this.data.distance = distance.toFixed(0);
      }
    }
    _this.setData({
      shopInfo: shopInfo,
      distance: _this.data.distance,
      pickUpOnself: pickUpOnself, // 全局数据中取出用户打包方式
    })

    // 如果商品列表为空，则在调用获取商品的方法
    if (_this.data.list == null) {
      _this.getProductInfo(function(result) {
        _this.setData({
          list: result,
        })
      });
    }
  },

  // 获取商品信息的方法
  getProductInfo: function(result) {
    var _this = this;
    var preURL = app.globalData.preURL;
    if (app.globalData.shopInfo != null) {
      // 发起后台商品信息请求
      wx.request({
        url: preURL + '/product/get_all_product_infos/req',
        method: "POST",
        data: {
          shopObj: app.globalData.shopInfo.id,
        },
        // 成功
        success: function(res) {
          var items = res.data.body;
          result(items);
        },
        // 失败
        fail: function() {
          console.log("访问错误，请稍后再试...");
        }
      })
    }
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