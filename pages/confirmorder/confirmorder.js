// pages/confirmorder/confirmorder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log("confirmorder.js");
    // console.log(e);
    // var _this =this;
    // _this.data.carts = e.carts;
    // _this.setData({
    //   carts: _this.data.carts,
    // })

    // 获取缓存数据（购物车的缓存数组）  
    var arr = wx.getStorageSync('cart');

    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      // 更新数据  
      this.setData({
        carts: arr,
      });
    } else {
      wx.showToast({
        title: '暂无数据',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})