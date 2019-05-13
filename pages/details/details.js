var util = require("../../utils/util.js")
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
    var myLike = wx.getStorageSync("myLike") || [];

    // 根据productID请求后台数据
    wx.request({
      url: preURL + '/product/get_one_product_info/req',
      method: "POST",
      data: {
        productID: productID,
        shopObj: app.globalData.shopInfo.id,
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
          productRemark: productDetail.productRemark,
          productType: productDetail.productType,
          productTypeName: productDetail.productTypeName,
          registeredAddress: productDetail.registeredAddress,
          sellQuantity: productDetail.sellQuantity,
          shopObj: productDetail.shopObj,
          stockQuantity: productDetail.stockQuantity,
          activityPrice: productDetail.productActivityPrice,
          realPrice: productDetail.productRealPrice,
          price: productDetail.productRealPrice,
          totalMoney: productDetail.productRealPrice, // 购买总价
          count: 1, // 默认商品购买数量
        }

        // 如果活动价格不为空，则将商品出售价格改为活动价格
        if (goods.activityPrice != null){
          goods.price = goods.activityPrice;
          goods.totalMoney = goods.activityPrice; // 购买总价
        }
        // 遍历用户收藏列表判断用户是否收藏该商品
        var found = false;
        if (myLike.length > 0){
          let i = 0;
          for (i = 0; i < myLike.length ; i++){
            if (goods.productID === myLike[i].productID){
              found = true;
              break;
            }
          }
        }
        if(found){
          _this.setData({
            isLike: !_this.data.isLike
          })
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
  addLike(e) {
    console.log(e);
    var _this = this;
    var productID = e.currentTarget.dataset.productid;
    var myLike = wx.getStorageSync("myLike") || [];

    // 1.如果缓存中有商品
    var foundFlog = false;
    if(myLike.length > 0){
      let i = 0;
      for(i = 0;i<myLike.length;i++){
        if (productID === myLike[i].productID){
          // 缓存中有数据，移除该商品
          myLike.splice(i,1);
          foundFlog = true;
          break;
        }
      }
      // 缓存中没有该商品信息
      if(!foundFlog){
        myLike.push(_this.data.goods);
      }
    } else {
      // 2.如果缓存中没有该商品，则添加该商品信息到缓存中
      myLike.push(_this.data.goods);
    }
    // 更新数据至缓存中
    console.log("更新收藏数据为：",myLike);
    wx.setStorageSync("myLike", myLike);
    _this.setData({
      isLike: !_this.data.isLike
    });
  },

  // 购物车
  toCar() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },

  // 立即购买
  immeBuy() {
    if (app.globalData.userInfo == null) {
      util.tipsInfo();
    } else {
      app.globalData.isImmediatelyBuy = true;
      var arr = new Array();
      arr.push(this.data.goods);
      wx.setStorageSync('buyNow', arr);
      wx.navigateTo({
        url: '/pages/confirmorder/confirmorder',
      })
    }
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
    // this.data.goods.totalMoney = this.data.goods.price * this.data.goods.count;
    this.data.goods.totalMoney = util.multiply(this.data.goods.price, this.data.goods.count);
    this.setData({
      goods: this.data.goods
    })
  },

  // 加入购物车(放入缓存中)
  addCar: function(e) {
    app.globalData.isImmediatelyBuy = false;
    // 加入购物车的商品
    var goods = this.data.goods;

    // 在缓存中添加商品是否被选择标记字段，默认未选中
    goods.isSelect = false;
    // 加入购物车的商品数量
    var count = this.data.goods.count;
    console.log(count + "个商品加入购物车");

    // 加入购物车的商品名称
    var title = this.data.goods.productName;
    console.log(title + "|| 商品加入了购物车");

    // 如果商品的名称长度大于10，则显示部分信息
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
        if (arr[j].goodsId === goods.goodsId) {
          // 相等的话，缓存中的count+再次购买的商品数量（即再次添加入购物车）  
          arr[j].count = arr[j].count + goods.count;
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
        duration: 1300
      });
      this.closeDialog();
      return;
    } catch (e) {
      console.log(e)
    }
  }

})