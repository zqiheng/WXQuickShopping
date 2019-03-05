const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    iscart: false,    // 缓存中是否有购物车
    hidden: true,     // 是否隐藏组件
    isAllSelect: false, // 是否全部选中
    totalMoney: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onShow: function() {
    // 获取缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    console.info("缓存数据：" + arr);

    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      // 更新数据  
      this.setData({
        carts: arr,
        iscart: true,
        hidden: false
      });
      // console.info("缓存数据：" + this.data.carts);

    } else {
      this.setData({
        iscart: false,
        hidden: true,
      });
    }
  },

  // 勾选事件处理函数  
  switchSelect: function(e) {
    // 获取item项的id，和数组的下标值  
    var Allprice = 0,
      i = 0;
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);

    this.data.carts[index].isSelect = !this.data.carts[index].isSelect;
    //价钱统计
    if (this.data.carts[index].isSelect) {
      // 如果选中改商品
      this.data.totalMoney = this.data.totalMoney + (this.data.carts[index].price * this.data.carts[index].count);
    } else {
      // 如果没有选中改商品
      this.data.totalMoney = this.data.totalMoney - (this.data.carts[index].price * this.data.carts[index].count);
    }

    //是否全选判断
    for (i = 0; i < this.data.carts.length; i++) {
      Allprice = Allprice + (this.data.carts[index].price * this.data.carts[index].count);
    }
    if (Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    } else {
      this.data.isAllSelect = false;
    }

    this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
  },

  // 全选事件处理
  allSelect: function(e) {

    //处理全选逻辑
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney = 0;
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = true;
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }

    } else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,
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
    // 判断用户是否授权登陆
    if (userInfo === null) {
      wx.showToast({
        title: '请先登陆哦🙂',
        icon: 'loading',
        duration: 2000
      });
    } else {
      // 判断用户是否有选中的商品
      let i = 0, isHave = false;
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
          icon: 'loading',
          duration: 1500
        });
      } else {
        // 满足上面条件，跳转页面
        wx.navigateTo({
          url: '/pages/confirmorder/confirmorder?carts='+this.data.carts,
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


  /* 减数 */
  delCount: function(e) {
    var index = e.target.dataset.index;
    var count = this.data.carts[index].count;
    // 商品总数量-1
    if (count > 1) {
      this.data.carts[index].count--;
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts
    });
    console.log("carts:" + this.data.carts);
    this.priceCount();
  },

  /* 加数 */
  addCount: function(e) {
    var index = e.target.dataset.index;
    var count = this.data.carts[index].count;
    // 商品总数量+1  
    if (count < 10) {
      this.data.carts[index].count++;
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts
    });
    console.log("carts:" + this.data.carts);
    this.priceCount();
  },
  priceCount: function(e) {

    this.data.totalMoney = 0;
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].isSelect == true) {
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }

    }
    this.setData({
      totalMoney: this.data.totalMoney,
    })
  },


  /* 删除item */
  delGoods: function(e) {
    this.data.carts.splice(e.target.id.substring(3), 1);
    // 更新data数据对象  
    if (this.data.carts.length > 0) {
      this.setData({
        carts: this.data.carts
      })
      wx.setStorageSync('cart', this.data.carts);
      this.priceCount();

    } else {
      this.setData({
        cart: this.data.carts,
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

})