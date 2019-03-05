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
    
    // 获取用户经纬度，来判断距离用户最近的商铺
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度 
      success: function (res) {
        var latitude = res.latitude //维度 
        var longitude = res.longitude //经度 
        console.log("维度：" + latitude + "   经度：" + longitude);
        // that.loadCity(latitude, longitude);
      }
    })
    
  },

  //点击扫描图片事件
  imageButton: function(e) {
    var _this = this;
    var preURL = app.globalData.preURL;

    //扫描API
    wx.scanCode({
      success: function(res) {
        _this.setData({
          codeMsg: res.result
        });

        // 根据扫描productID请求后台数据
        wx.request({
          url: preURL+'/product/get_one_product_info/req',
          method: "POST",
          data: {
            "productID": res.result,
          },
          // 成功
          success: function(data) {
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
                duration: 2000,
              })
            }
          },
          fail: function() {
            wx.showToast({
              title: '加载信息失败',
              duration: 3000,
            })
          }
        })
      }
    })
  }
  
})