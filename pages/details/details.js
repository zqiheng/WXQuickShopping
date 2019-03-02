Page({
  data: {
    isLike: false,
    showDialog: false,
    goods: {
      productID: 123456,
      productName:"好吃点香脆核桃饼",
      imageUrl: "http://img5.21food.cn/img/album/2017/9/3/food13438212011028V5.jpg",
      price: 4.5,
      stockNum: 500,
      sellNum: 288,
      count: 0, // 默认购买商品数量
      totalMoney: 0,
    },
  },

  // 渲染数据
  onLoad: function(event) {
    console.log(event);
    var _this = this;
    var productID = event.productID;

    // 根据productID请求后台数据
    wx.request({
      url: 'http://localhost:8080/product/get_one_product_info/req',
      method: "POST",
      data:{
        "productID": productID,
      },
      // 成功
      success: function (data) {
        console.log(data.data.body);
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

  /**
   * sku 弹出
   */
  toggleDialog: function() {
    var _this = this;
    _this.setData({
      showDialog: !_this.data.showDialog
    });
  },
  /**
   * sku 关闭
   */
  closeDialog: function() {
    console.info("关闭");
    this.setData({
      showDialog: false
    });
  },

  /* 减数 */
  delCount: function(e) {
    console.log("刚刚您点击了减1");
    var count = this.data.goods.count;
    // 商品总数量-1
    if (count > 1) {
      this.data.goods.count--;
    }
    // 将数值与状态写回  
    this.setData({
      goods: this.data.goods
    });
    this.priceCount();
  },
  /* 加数 */
  addCount: function(e) {
    console.log("刚刚您点击了加1");
    var count = this.data.goods.count;
    // 商品总数量-1  
    if (count < 10) {
      this.data.goods.count++;
    }
    // 将数值与状态写回  
    this.setData({
      goods: this.data.goods
    });
    this.priceCount();
  },
  //价格计算
  priceCount: function(e) {
    this.data.goods.totalMoney = this.data.goods.price * this.data.goods.count;
    this.setData({
      goods: this.data.goods
    })
  },

  /**
   * 加入购物车
   */
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