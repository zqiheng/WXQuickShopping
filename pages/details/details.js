const app = getApp();

Page({
  data: {
    isLike: false,
    showDialog: false,
    totalMoney: 0,
    count: 0,
    goods: {},
  },

  // 页面加载时渲染数据
  onLoad: function(event) {
    var preURL = app.globalData.preURL;
    // console.log(event);
    var _this = this;
    var productID = event.productID;

    // 根据productID请求后台数据
    wx.request({
      url: preURL+'/product/get_one_product_info/req',
      method: "POST",
      data:{
        "productID": productID,
      },
      // 成功
      success: function (data) {
        console.log(data.data.body);
        _this.setData({
          goods: data.data.body,
        })
      },
      fail: function(){
        wx.showToast({
          title: '加载信息失败，请稍后再试...',
        })
      }
    })
  },

  // 收藏  待开发
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
  },

  // 跳到购物车  待开发
  toCar() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },

  // 立即购买  待开发
  immeBuy() {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
  },

  // sku 弹出
  toggleDialog: function() {
    var _this = this;
    _this.setData({
      showDialog: !_this.data.showDialog
    });
  },

  // sku 关闭
  closeDialog: function() {
    console.info("关闭");
    this.setData({
      showDialog: false
    });
  },

  // 减数事件
  delCount: function(e) {
    var count = this.data.count;
    // 商品总数量-1
    if (count > 1) {
      this.data.count--;
    }
    // 将数值与状态写回  
    this.setData({
      count: this.data.count,
    });
    this.priceCount();
  },

  // 加数事件
  addCount: function(e) {
    var count = this.data.count;
    // console.log(count);
    // 商品总数量-1  
    if (count < 10) {
      this.data.count++;
    }
    // 将数值与状态写回  
    this.setData({
      count: this.data.count,
    });
    // console.log("==========="+this.data.count);
    this.priceCount();
  },

  //价格计算
  priceCount: function(e) {
    this.data.totalMoney = this.data.goods.productRealPrice * this.data.count;
    this.setData({
      totalMoney: this.data.totalMoney,
    });
    // console.log("TotalMoney: " + this.data.totalMoney);
  },

  // 加入购物车
  addCar: function(e) {
    var count = this.data.goods.count;
    // ajax.request({
    //   method: 'GET',
    //   url: 'carts/addShopCarts?key=' + utils.key + '&goodsId=' + goodsId + '&num=' + count,
    //   success: data => {
    //     console.log("加入购物车返回结果：" + data.message)
    //     wx.showToast({
    //       title: '加入购物车成功',
    //       icon: 'success',
    //       duration: 2000
    //     });
    //   }
    // })
  }

})