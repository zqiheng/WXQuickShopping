var util = require("../../utils/util.js")
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    iscart: false, // 缓存中是否有购物车
    hidden: true, // 是否隐藏组件
    isAllSelect: false, // 是否全部选中
    totalMoney: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 购物车缓存数据读取
   */
  onShow: function() {
    var _this = this;

    // 【数据分离】考虑用户购物车问题。如果用户的店铺更换则应该清空购物车中的缓存数据。
    var arr = wx.getStorageSync("cart") || [];
    if (arr.length > 0) {
      var shopObj = arr[0].shopObj;
      if (app.globalData.shopInfo.id != shopObj) {
        try {
          wx.setStorageSync("cart", []);
        } catch (e) {
          console.log(e);
        }
      }
    }

    // 获取缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    console.info("购物车中的数据：" , arr);

    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      // 更新数据  
      _this.setData({
        carts: arr,
        iscart: true,
        hidden: false
      });
      // console.info("缓存数据：" + this.data.carts);

    } else {
      // 更新数据 
      _this.setData({
        iscart: false,
        hidden: true,
      });
    }
  },

  // 勾选事件处理函数  
  switchSelect: function(e) {
    var _this = this;
    // 获取item项的id，和数组的下标值  
    var Allprice = 0,
      i = 0;
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);

    _this.data.carts[index].isSelect = !_this.data.carts[index].isSelect;
    //价钱统计
    if (_this.data.carts[index].isSelect) {
      // 如果选中改商品
      _this.data.totalMoney = _this.data.totalMoney + (util.multiply(_this.data.carts[index].price, this.data.carts[index].count));
    } else {
      // 如果没有选中改商品
      if (_this.data.totalMoney > 0) {
        _this.data.totalMoney = _this.data.totalMoney - (util.multiply(_this.data.carts[index].price, this.data.carts[index].count));
      }
    }

    // 是否全选判断
    for (i = 0; i < _this.data.carts.length; i++) {
      Allprice = Allprice + ((util.multiply(_this.data.carts[i].price, this.data.carts[i].count)));
    }
    if (Allprice == _this.data.totalMoney) {
      _this.data.isAllSelect = true;
    } else {
      _this.data.isAllSelect = false;
    }

    // set数据
    _this.setData({
      carts: _this.data.carts,
      totalMoney: _this.data.totalMoney,
      isAllSelect: _this.data.isAllSelect,
    })
  },

  // 全选事件处理
  allSelect: function(e) {
    var _this = this;
    //处理全选逻辑
    let i = 0;
    if (!this.data.isAllSelect) {
      _this.data.totalMoney = 0;
      for (i = 0; i < _this.data.carts.length; i++) {
        // 标记商品被选中
        _this.data.carts[i].isSelect = true;
        // 该商品的总价格
        _this.data.totalMoney = _this.data.totalMoney + (util.multiply(_this.data.carts[i].price, this.data.carts[i].count));
      }
    } else {
      for (i = 0; i < _this.data.carts.length; i++) {

        _this.data.carts[i].isSelect = false;
      }
      _this.data.totalMoney = 0;
    }
    // set数据
    _this.setData({
      carts: _this.data.carts,
      isAllSelect: !_this.data.isAllSelect,
      totalMoney: _this.data.totalMoney,
    })
  },

  // 去结算
  toBuy() {
    /**
     * 逻辑：
     * 1.流程开始---
     * 2.判断用户是否登陆，如果没有登陆，停止该流程，提示用户授权登陆
     * 3.判断用户是否有选中的商品，如果没有，停止该流程，提示用户选择支付的商品
     * 4.如果满足上面两个条件，则将用户要购买的商品信息跳转到订单确定页面
     * 5.结束流程---
     */
    var userInfo = app.globalData.userInfo;
    // 判断用户是否授权登陆 如果没有则引导用户授权登陆
    if (userInfo === null) {
      util.tipsInfo();
    } else {
      // 判断用户是否有选中的商品
      let i = 0,
        isHave = false;
      for (i = 0; i < this.data.carts.length; i++) {
        if (this.data.carts[i].isSelect === true) {
          isHave = true;
          break;
        }
      }
      if (!isHave) {
        // 如果用户没有选中要购买的商品，提示用户选中商品
        wx.showToast({
          title: '请选中商品',
          duration: 2000
        });
      } else {
        // 满足上面条件
        // 1.将购物车缓存中被选中的的数据加入到用户需要购买的新缓存数据中
        var arr = wx.getStorageSync('cart') || [];
        var buy = wx.getStorageSync('buyCart') || [];

        if (arr.length > 0) {
          let i = 0;
          for (i = 0; i < arr.length; i++) {
            if (this.data.carts[i].isSelect === true) {
              // 1.1 将被选中的商品加入新的数组
              buy.push(this.data.carts[i]);
              // 1.2 同时将被选中的商品从cart缓存中移除

            }
          }
          try {
            // 将用户需要购买的商品信息放入新的缓存数据
            wx.setStorageSync('buyCart', buy);
          } catch (e) {
            console.log(e);
          }
        }
        // 2.跳转页面
        wx.navigateTo({
          url: '/pages/confirmorder/confirmorder',
        })
      }
    }
  },


  // 数量变化处理
  handleQuantityChange(e) {
    var componentId = e.componentId;
    var quantity = e.quantity;
    this.data.carts[componentId].count.quantity = quantity;
    this.setData({
      carts: this.data.carts,
    });
  },


  // 减数
  delCount: function(e) {
    var _this = this;
    var index = e.target.dataset.index;
    var count = _this.data.carts[index].count;
    // 商品总数量-1
    if (count > 1) {
      _this.data.carts[index].count--;
    }
    // 将数值与状态写回  
    _this.setData({
      carts: _this.data.carts
    });
    // console.log("carts:" + _this.data.carts);
    _this.priceCount();
  },

  // 加数
  addCount: function(e) {
    var _this = this;
    var index = e.target.dataset.index;
    var count = _this.data.carts[index].count;
    // 商品总数量+1  
    if (count < 10) {
      _this.data.carts[index].count++;
    }
    // 将数值与状态写回  
    _this.setData({
      carts: _this.data.carts
    });
    // console.log("carts:" + _this.data.carts);
    _this.priceCount();
  },


  // 总价格
  priceCount: function(e) {
    var _this = this;
    _this.data.totalMoney = 0;

    for (var i = 0; i < _this.data.carts.length; i++) {
      if (_this.data.carts[i].isSelect == true) {
        _this.data.totalMoney = _this.data.totalMoney + (util.multiply(_this.data.carts[i].price, this.data.carts[i].count));
      }
    }

    _this.setData({
      totalMoney: _this.data.totalMoney,
    })
  },


  // 删除item
  delGoods: function(e) {
    var _this = this;
    _this.data.carts.splice(e.target.id.substring(3), 1);
    // 更新data数据对象  
    if (_this.data.carts.length > 0) {
      _this.setData({
        carts: _this.data.carts
      })
      wx.setStorageSync('cart', _this.data.carts);
      _this.priceCount();

    } else {
      _this.setData({
        cart: _this.data.carts,
        iscart: false,
        hidden: true,
      })
      wx.setStorageSync('cart', []);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var _this = this;
    _this.setData({
      totalMoney: 0,
      isAllSelect: false,
    })
  },

  /**
   * 生命周期函数--监听页面销毁
   */
  onUnload: function() {
    var _this = this;
    _this.setData({
      totalMoney: 0,
      isAllSelect: false,
    })
  },
})