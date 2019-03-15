//app.js
App({
  globalData: {
    userInfo: null, // 用户信息
    preURL: "http://zqiheng.e1.luyouxia.net:30795", // 后台接口请求地址
    shopInfo: null, // 加载首页时，默认选择距离用户最近的商店
    pickUpOnself: true,   // 默认用户选择自提
    clearCarts: true,        // 是否清除购物车，默认清除
  },

  onLaunch: function() {
    
  },

  onShow: function(){
    var _this = this;
    var preURL = _this.globalData.preURL;
    // 获取用户地理定位
    // 获取用户经纬度，来判断距离用户最近的商铺
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度 
      success: function (res) {
        var longitude = res.longitude; //经度 
        var latitude = res.latitude; //维度 
        console.log("经度：" + longitude + "  维度：" + latitude);
        // 请求后台数据返回距离最近的商店
        wx.request({
          url: preURL + '/find_specify_shop_by_position',
          method: 'POST',
          data: {
            longitude: longitude,
            latitude: latitude,
          },
          success: function (res) {
            var shop = res.data.body;
            if (res.data.code === 0) {
              _this.globalData.shopInfo = shop;
              // try{
              //   /**
              //    * 1. 先判断缓存中有没有商店信息
              //    * 2. 如果没有数据就将店铺的信息放入缓存 （清空购物车）
              //    * 3. a.如果有数据就表明有店铺信息（但不确定是那一次的店铺信息）
              //    *    b.如果缓存中有店铺信息，就把店铺信息取出与现在定位出的店铺信息匹配
              //    *      如果相等（不用清除购物车）
              //    *      如果不相等（清除购物车）
              //    */
              //   var temp = wx.getStorageSync("shopInfo");
              //   if(temp === null){
              //     // 缓存中没有信息，将店铺信息放入缓存中
              //     wx.setStorageSync("shopInfo", shop);
              //     // 清除购物车
              //     _this.globalData.clearCarts = true;
              //   } else {
              //     // 缓存中有信息
              //     if (temp.id === shop.id){
              //       _this.globalData.clearCarts = false;
              //     } else {
              //       _this.globalData.clearCarts = true;
              //     }
              //   }
                
              // } catch(e){
              //   console.log(e);
              // }
              console.log(_this.globalData.shopInfo);
            }
          },
          fail: function () {
            wx.showToast({
              title: '获取店铺失败',
              duration: 1500,
            })
          }
        })
      },
      fail: function () {
        wx.showModal({
          title: '用户未授权',
          content: '如需正常使用小程序功能，需要授权定位哦！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              
            }
          }
        })
      }
    })
  }
})