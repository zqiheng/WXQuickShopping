
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    isSelect: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    // 当此页面加载时，先从缓存中拿数据
    var arr = wx.getStorageSync('addressList') || [];
    if (arr.length > 0) {
      // 更新数据  
      _this.setData({
        addressList: arr,
      });
    } else {
      // 缓存中没有数据则需要从数据库中拿数据，并将数据放入缓存中
      var preURL = app.globalData.preURL;
      var userObj = app.globalData.userInfo.id;
      wx.request({
        url: preURL + '/address/get_user_address/req',
        method: 'POST',
        data: {
          userObj: userObj,
          consigneeInfos: null,
        },
        success: function (res) {
          var addressInfo = res.data.body;
          // console.log(res.data.body);
          // 更新数据  
          _this.setData({
            addressList: addressInfo,
          });
          // 放入缓存
          wx.setStorageSync('addressList', addressInfo);
        }
      })
    }
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
  },

  // 选中其中一个地址时，设置为默认地址
  selectTheDefaultAddress: function(e){
    var _this =this;
    // 选中的数组下标
    var index = e.currentTarget.id;
    console.log(e);

    var arr = _this.data.addressList;
    // console.log("选中默认收货地址下标为：" + index);
    // 取出用户选择的默认地址
    var defaultAddress = _this.data.addressList[index];
    let i = 0;
    for (i = 0; i < arr.length; i++){
      if(i === index){
        arr[i].idDefaultAddress = true;
      } else{
        arr[i].idDefaultAddress = false;
      }
    }

    // Todo:zqiheng  此处考虑是否同步数据库

    // 设置数据
    _this.setData({
      addressList: arr,
    })

    // 将默认派送地址放入缓存
    try{
      wx.setStorageSync("defaultAddress", defaultAddress);
    }catch(even){
      console.log(even);
    }
    // 返回上一页
    wx.navigateBack({})
  },

  /**
   * 监听用户下拉刷新页面
   */
  onPullDownRefresh: function(){

    var _this = this;

    //在标题栏中显示加载
    wx.showNavigationBarLoading();

    // 缓存中没有数据则需要从数据库中拿数据，并将数据放入缓存中
    var preURL = app.globalData.preURL;
    var userObj = app.globalData.userInfo.id;
    wx.request({
      url: preURL + '/address/get_user_address/req',
      method: 'POST',
      data: {
        userObj: userObj,
        consigneeInfos: null,
      },
      success: function (res) {
        var addressInfo = res.data.body;
        // console.log(res.data.body);
        // 更新数据  
        _this.setData({
          addressList: addressInfo,
        });
        // 放入缓存
        wx.setStorageSync('addressList', addressInfo);
      },
      complete: function () {
         //完成停止加载
        wx.hideNavigationBarLoading()
         //停止下拉刷新
        wx.stopPullDownRefresh()
      }
    })
  }

})