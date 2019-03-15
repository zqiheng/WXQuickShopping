var app = getApp()

Page({

  data: {
    orders: null, // 订单列表数组
    winWidth: 0, // 屏幕宽度
    winHeight: 0, // 屏幕高度
    currentTab: 0, // tab标记，默认在第一页
    completedOrders: [], // 已完成订单
    pickUpOneselfOrders: [], // 待自提订单
    dispatchOrders: [], // 待配送订单
    receivingOrders: [], // 待收货订单
    canceledOrders: [], // 已取消订单 
  },

  /**
   * 监听页面加载时动作
   */
  onLoad: function(e) {
    var _this = this;

    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res);
        // 获取用户屏幕的宽度高度
        _this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          currentTab: e.typeId,
        });
      }
    });
  },

  /**
   * 监听页面显示事件
   */
  onShow: function(e) {
    var _this = this;
    var userInfo = app.globalData.userInfo;
    var preURL = app.globalData.preURL;

    // 根据用户信息查找用户订单表
    if (userInfo) {
      wx.request({
        url: preURL + '/orders/get_orders_info/req',
        method: 'POST',
        data: {
          userObj: userInfo.id,
        },
        success: function(res) {
          var code = res.data.code;

          // 定义5个数组【数组里面存放订单信息对象】
          var completedArr = new Array();
          var pickUpOneselfArr = new Array();
          var dispatchArr = new Array();
          var receivingArr = new Array();
          var canceledArr = new Array();

          if (code === 0) {
            var arr = res.data.body;
            console.log(arr);
            if (arr.length > 0) {
              let i = 0;
              for (i = 0; i < arr.length; i++) {
                var order = arr[i];
                /**
                 * 0：已完成、1：待自提、2：待配送、3：待收货、4：已取消
                 */
                if (order.ordersType === 0) {
                  completedArr.push(order);
                } else if (order.ordersType === 1) {
                  pickUpOneselfArr.push(order)
                } else if (order.ordersType === 2) {
                  dispatchArr.push(order);
                } else if (order.ordersType === 3) {
                  receivingArr.push(order);
                } else {
                  canceledArr.push(order);
                }
              }
            }

            _this.setData({
              completedOrders: completedArr,
              dispatchOrders: dispatchArr,
              pickUpOneselfOrders: pickUpOneselfArr,
              receivingOrders: receivingArr,
              canceledOrders: canceledArr,
            })

            console.log("已完成订单：" + _this.data.completedOrders);
            console.log("待自提订单：" + _this.data.pickUpOneselfOrders);
            console.log("待配送订单：" + _this.data.dispatchOrders);
            console.log("待收货订单：" + _this.data.receivingOrders);
            console.log("已取消订单：" + _this.data.canceledOrders);

          }
          // else{
          //   wx.showToast({
          //     title: '请稍后再试！',
          //     duration: 1500,
          //   })
          // }
        }
      })
    }
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