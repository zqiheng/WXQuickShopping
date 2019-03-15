const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [], // 用户需要购买的商品信息
    shop: null, // 用户自提店铺信息
    totalMoney: 0, // 确认订单页面用户需要支付的总金额
    // pickUpOnself: true,   // 表示用户选择自提，（ true ： 隐藏外送时的时间显示区）
    dispatchAddress: null, // 用户选择配送时的地址信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var _this = this;
    var shopInfo = app.globalData.shopInfo;
    var pickUpOnself = app.globalData.pickUpOnself;
    // 获取缓存数据（用户需要购买商品的缓存数组）  
    var arr = wx.getStorageSync('buyCart') || [];
    console.log("用户需要购买的商品：" + arr);
    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      let i = 0;
      var totalMoney = 0;
      for (i = 0; i < arr.length; i++) {
        totalMoney += arr[i].count * arr[i].price;
      };
      // console.log("总价格：" + count);
      // 更新数据  
      _this.setData({
        carts: arr,
        shop: shopInfo,
        totalMoney: totalMoney,
        pickUpOnself: pickUpOnself,
      });
    } else {
      wx.showToast({
        title: '暂无数据',
      })
    }
  },

  onShow: function(e) {
    // 加载用户配送地址
    var _this = this;
    // 获取缓存中的配送地址信息
    var defaultAddress = wx.getStorageSync('defaultAddress') || [];

    var pickUpOnself = app.globalData.pickUpOnself;
    if (defaultAddress != null) {
      _this.setData({
        dispatchAddress: defaultAddress,
        pickUpOnself: pickUpOnself,
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

  /**
   * 监听页面隐藏
   */
  onHide: function(e) {
    console.log("确认订单页面隐藏！");
    // 当确认订单页面隐藏时，清空用户需要购买的商品信息
    // try {
    //   wx.setStorageSync('buyCart', []);
    // } catch (e) {
    //   console.log("清空数组失败！");
    // }
  },

  /**
   * 监听页面销毁
   */
  onUnload: function(e) {
    console.log("确认订单页面销毁！");
    // 当确认订单页面隐藏时，清空用户需要购买的商品信息
    try {
      wx.setStorageSync('buyCart', []);
    } catch (e) {
      console.log("清空数组失败！");
    }
  },

  /**
   * 支付
   */
  payFor: function(e) {

    var _this = this;
    // 取出全局变量中用户信息、店铺信息、和配送方式
    var shopInfo = app.globalData.shopInfo;
    var userInfo = app.globalData.userInfo;
    var preURL = app.globalData.preURL;
    var pickUpOnself = app.globalData.pickUpOnself;
    // 获取用户和店铺的主键
    var userObj = userInfo.id;
    var shopObj = shopInfo.id;

    // 用户需要购买的商品
    var arr = wx.getStorageSync('buyCart') || [];

    // 模拟微信支付
    wx.showModal({
      title: '确认支付',
      content: '已阅读支付协议，点击确定继续。',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          // console.log('用户点击确定');
          // console.log("地址Obj " + _this.data.dispatchAddress);
          /**
           * 用户点击确定：生成订单
           * 1. 如果用户选择自提：则为自提订单
           * 2. 如果用户选择派送：则为派送订单
           * 需要保存的信息：用户ID、店铺ID、提货方式（0 自提、1 派送【派送需关联地址】）
           * 订单创建时间（后台生成）、订单状态（1 待自提、2 待配送） 商品信息及价格
           * 
           * 备注：这里同一传入所有信息去后台处理判断订单是属于那类订单信息。
           */

          if (userInfo) {
            wx.request({
              url: preURL + '/orders/add_orders_info/add',
              method: 'POST',
              data: {
                userObj: userObj,
                shopObj: shopObj,
                addressObj: _this.data.dispatchAddress.id,
                pickUpOnself: pickUpOnself,
                goodsItems: _this.data.carts,
                payFlag: true,
                ordersRemark: null,
              },
              success: function(res) {
                console.log(res);
                var code = res.data.code;
                if(code === 0){
                  // Todo:ZQI 购买成功返回商城  并 清空用户已经购物的商品缓存
                  wx.showToast({
                    title: '购买成功',
                  })
                }
              }
            })
          }
        } else {
          console.log('用户点击取消')
          /**
           * 用户点击取消：生成未完成订单
           */
          if (userInfo) {
            wx.request({
              url: preURL + '/orders/add_orders_info/add',
              method: 'POST',
              data: {
                userObj: userObj,
                shopObj: shopObj,
                addressObj: _this.data.dispatchAddress.id,
                pickUpOnself: pickUpOnself,
                goodsItems: _this.data.carts,
                payFlag: false,
                ordersRemark: null,
              },
              success: function (res) {
                console.log(res);
                var code = res.data.code;
                if (code === 0) {
                  // Todo:ZQI 
                }
              }
            })
          }
        }
      }
    })
  },

  /**
   * 选择地址事件
   */
  selectAddress: function() {
    wx.navigateTo({
      url: '../addressList/addressList',
    })
  }

})