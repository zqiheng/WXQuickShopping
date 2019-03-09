
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    isNull: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var arr = wx.getStorageSync('addressList') || [];
    if(arr.length > 0){
      this.data.isNull = !this.data.isNull;
    }
    console.info("缓存数据：" + arr);
    // 更新数据  
    this.setData({
      addressList: arr,
      isNull: this.data.isNull,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  // 添加地址
  addAddress: function () {
    wx.navigateTo({ url: '../address/address' });
  },


  // 删除地址
  delAddress: function (e) {
    console.log("删除地址信息：" + e.target.id);
    this.data.addressList.splice(e.target.id.substring(3), 1);
    // 更新data数据对象  
    if (this.data.addressList.length > 0) {
      // 如何list中有数据
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', this.data.addressList);
    } else {
      // 如果list中没有数据
      this.setData({
        addressList: this.data.addressList
      })
      wx.setStorageSync('addressList', []);
    }

    // 同步到数据库中
    var preURL = app.globalData.preURL;
    var userObj = app.globalData.shopInfo.id;
    wx.request({
      url: preURL + '/address/add_user_address/add',
      method: 'POST',
      data: {
        userObj: userObj,
        consigneeInfos: this.data.addressList,
      }
    })
  }

})