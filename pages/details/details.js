const app = getApp();

var goodsId = null;
var goods = null;

Page({
  data: {
    isLike: false,
    showDialog: false,
    goods: null,
  },

  // 页面加载时渲染数据
  onLoad: function(event) {
    var preURL = app.globalData.preURL;
    // console.log(event);
    var _this = this;
    var productID = event.productID;

    // 根据productID请求后台数据
    wx.request({
      url: preURL + '/product/get_one_product_info/req',
      method: "POST",
      data: {
        "productID": productID,
      },
      // 成功
      success: function(data) {
        console.log(data.data.body);
        var productDetail = data.data.body;

        // 渲染数据
        goods = {
          goodsId: productDetail.id,
          productID: productDetail.productID,
          productName: productDetail.productName,
          productBrand: productDetail.productBrand,
          factoryName: productDetail.factoryName,
          productNorm: productDetail.productNorm,
          productPackingUnit: productDetail.productPackingUnit,
          productPicture: productDetail.productPicture,
          productProposedPrice: productDetail.productProposedPrice,
          productRemark: productDetail.productRemark,
          productType: productDetail.productType,
          productTypeName: productDetail.productTypeName,
          registeredAddress: productDetail.registeredAddress,
          sellQuantity: productDetail.sellQuantity,
          shopObj: productDetail.shopObj,
          stockQuantity: productDetail.stockQuantity,
          price: productDetail.productRealPrice,
          count: 1, // 默认商品购买数量
          totalMoney: productDetail.productRealPrice // 购买总价
        }
        _this.setData({
          goods: goods,
        })
      },
      fail: function() {
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

  /* 减数 */
  delCount: function(e) {
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

  // 加入购物车(放入缓存中)
  addCar: function(e) {
    // 加入购物车的商品
    var goods = this.data.goods;

    // 添加是否被选择标记
    goods.isSelect = false;
    // 加入购物车的商品数量
    var count = this.data.goods.count;
    console.log(count + "个商品加入购物车");

    // 加入购物车的商品名称
    var title = this.data.goods.productName;
    console.log(title + "|| 商品加入了购物车");

    // 如果商品的名称成都大于10，则显示部分信息
    if (title.length > 10) {
      goods.productName = title.substring(0, 10) + '...';
    }

    // 获取购物车的缓存数组（没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    console.log("arr,{}", arr);

    if (arr.length > 0) {
      // 遍历购物车数组  
      for (var j in arr) {
        // 判断购物车内的item的id，和事件传递过来的id，是否相等  
        if (arr[j].goodsId == goodsId) {
          // 相等的话，给count+1（即再次添加入购物车，数量+1）  
          arr[j].count = arr[j].count + 1;
          // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）  
          try {
            wx.setStorageSync('cart', arr)
          } catch (e) {
            console.log(e)
          }
          //关闭窗口
          wx.showToast({
            title: '加入购物车！',
            icon: 'success',
            duration: 2000
          });
          this.closeDialog();
          // 返回（在if内使用return，跳出循环节约运算，节约性能） 
          return;
        }
      }
      // 遍历完购物车后，没有对应的item项，把goodslist的当前项放入购物车数组  
      arr.push(goods);
    } else {
      arr.push(goods);
    }

    // 最后，把购物车数据，存放入缓存  
    try {
      wx.setStorageSync('cart', arr)
      // 返回（在if内使用return，跳出循环节约运算，节约性能） 
      //关闭窗口
      wx.showToast({
        title: '加入购物车！',
        icon: 'success',
        duration: 2000
      });
      this.closeDialog();
      return;
    } catch (e) {
      console.log(e)
    }
  }

})