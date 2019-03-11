var app = getApp()

Page({
  data: {
    orders:null,     // 订单列表数组
    winWidth: 0,     // 屏幕宽度
    winHeight: 0,    // 屏幕高度
    currentTab: 0,   // tab标记，默认在第一页
  },

  /**
   * 监听页面加载时动作
   */
  onLoad: function() {
    var _this = this;
    
    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        // 获取用户屏幕的宽度高度
        _this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * 监听页面显示事件
   */
  onHide: function(e){
    var userInfo = app.globalData.userInfo;
    // 根据用户信息查找用户订单表

    // TODO:
  },

  /**
   * 滑动切换tab事件
   */
  bindChange: function(e) {
    var _this = this;
    _this.setData({
      currentTab: e.detail.current
    });

  },

  /**
   * 点击tab切换事件
   */
  swichNav: function(e) {

    var _this = this;

    if (_this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      _this.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})