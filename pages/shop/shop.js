// pages/shop/shop.js
Page({
  data: {
    // 左侧点击类样式
    curNav: 'A',
  },

  onLoad: function(){
    var _this = this;

    // 加载此页面时提示信息
    wx.showLoading({
      title: '数据加载中...',
    })

    // 发起后台商品信息请求
    wx.request({
      url: 'http://localhost:8080/product/get_all_product_infos/req',
      method: "POST",
      // 成功
      success: function(data){
        var items = data.data.body;
        console.log(items);
        _this.setData({
          list: items,
        });
        wx.hideLoading();
      },

      // 失败
      fail: function(){
        wx.showToast({
          title: '访问错误，请稍后再试...',
          icon: 'error'
        })
      }
    })

    // 获取可视区高度
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winHeight: res.windowHeight,
        })
      }
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