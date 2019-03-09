const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],            // 用户需要购买的商品信息
    shop: null,           // 店铺信息
    totalMoney: 0,        // 确认订单页面用户需要支付的总金额
    pickUpOnself: true,   // 表示用户选择自提，（ true ： 隐藏外送时的时间显示区）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var shopInfo = app.globalData.shopInfo;
    // 获取缓存数据（用户需要购买商品的缓存数组）  
    var arr = wx.getStorageSync('buyCart') || [];
    console.log("用户需要购买的商品：" + arr);

    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      let i = 0;
      var count = 0;
      for(i = 0; i < arr.length; i++){
        count += arr[i].count * arr[i].price;
      };

      // console.log("总价格：" + count);

      // 更新数据  
      this.setData({
        carts: arr,
        shop: shopInfo,
        totalMoney: count,
      });
    } else {
      wx.showToast({
        title: '暂无数据',
      })
    }
  },

  /**
   * 用户点击 自提 / 外送 事件
   */
  pickUp: function(e){
    var _this = this;
    _this.pickUpOnself = !_this.pickUpOnself;

    // 更新数据
    _this.setData({
      pickUpOnself: _this.pickUpOnself,
    })
  },

  /**
  * 监听页面隐藏
  */
  onHide: function (e) {
    console.log("确认订单页面隐藏！");
    // 当确认订单页面隐藏时，清空用户需要购买的商品信息
    try {
      wx.setStorageSync('buyCart', []);
    } catch (e) {
      console.log("清空数组失败！");
    }
  },

 /**
  * 监听页面销毁
  */
  onUnload: function(e){
    console.log("确认订单页面销毁！");
    // 当确认订单页面隐藏时，清空用户需要购买的商品信息
    try{
      wx.setStorageSync('buyCart', []);
    } catch(e){
      console.log("清空数组失败！");
    }
  },

  /**
   * 支付
   */
  payFor: function(e){

    wx.requestPayment(
      {
        'timeStamp': '',
        'nonceStr': '',
        'package': '',
        'signType': 'MD5',
        'paySign': '',
        'success': function (res) {

         },
        'fail': function (res) {
          wx.showToast({
            title: '支付成功',
            duration: 1000,
          })
         },
        'complete': function (res) { }
      }) 
  }

})