var util = require("../../utils/util.js")
var app = getApp()

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [{
        typeId: 1,
        name: '待自提',
      url: '../order/order?typeId=1',
        imageurl: '../../images/person/personal_pay.png',
      },
      {
        typeId: 2,
        name: '待配送',
        url: '../order/order?typeId=2',
        imageurl: '../../images/person/personal_comment.png'
      },
      {
        typeId: 3,
        name: '待收货',
        url: '../order/order?typeId=3',
        imageurl: '../../images/person/personal_receipt.png',
      }
    ],
  },

  // 页面加载时动作
  onLoad: function() {

    // 用户信息获取
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  // 获取用户信息
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    // 保存用户信息到数据中
    if (app.globalData.userInfo != null) {
      // console.log("保存用户信息到数据库中");
      var info = app.globalData.userInfo;
      var preURL = app.globalData.preURL;
      wx.request({
        url: preURL + '/user/add_user_info/add',
        method: "POST",
        data: {
          nickName: info.nickName,
          gender: info.gender,
          language: info.language,
          city: info.city,
          province: info.province,
          country: info.country,
          avatarUrl: info.avatarUrl,
        },
        // 将后台返回的用户信息保存到全局信息中（其中包含主键）
        success: function(res){
          app.globalData.userInfo = res.data.body;
        }
      });
    }
  },

  // 我的收藏
  myLike: function(e) {
    if (app.globalData.userInfo == null) {
      util.tipsInfo();
    } else {
      wx.navigateTo({
        url: '/pages/myLikes/myLikes',
      })
    }
  },

  // 我的地址
  myAddress: function(e) {
    if (app.globalData.userInfo != null) {
      wx.navigateTo({
        url: '../addressList/addressList'
      });
    } else {
      util.tipsInfo();
    }
  },

  // 用户点击订单区域时判断是否用用户信息
  noUserInfo: function(){
    if (app.globalData.userInfo == null) {
      util.tipsInfo();
    }
  },

  /**
   * 优惠券
   */
  myCoupon: function(){
    if (app.globalData.userInfo == null) {
      util.tipsInfo();
    } else {
      wx.navigateTo({
        url: '/pages/myCoupons/myCoupons',
      })
    }
  },

  /**
   * 在线客服
   */
  onLinePhone: function(){
    if (app.globalData.userInfo == null) {
      util.tipsInfo();
    } else {
      var shopInfo = app.globalData.shopInfo;
      var phone = shopInfo.shopTel;
        wx.makePhoneCall({
          phoneNumber: phone,
        })
    }
    
  },

  /**
   * 售后记录
   */
  saledRecord: function(){
    if (app.globalData.userInfo == null) {
      util.tipsInfo();
    } else {
      wx.navigateTo({
        url: '/pages/saledRecords/saledRecords',
      })
    }
  },

  /**
   * 我的评价
   */
  myEvaluation: function(){
    if (app.globalData.userInfo == null) {
      util.tipsInfo();
    } else {
      wx.navigateTo({
        url: '/pages/myEvaluations/myEvaluations',
      })
    }
  }
  
})