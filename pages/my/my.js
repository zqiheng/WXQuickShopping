var app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [{
        typeId: 0,
        name: '已完成',
        url: '../order/order',
        imageurl: '../../images/person/personal_pay.png',
      },
      {
        typeId: 1,
        name: '待收货',
        url: '../order/order',
        imageurl: '../../images/person/personal_receipt.png',
      },
      {
        typeId: 2,
        name: '待自提',
        url: '../order/order',
        imageurl: '../../images/person/personal_comment.png'
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

  },

  // 我的地址
  myAddress: function(e) {
    if (app.globalData.userInfo != null) {
      wx.navigateTo({
        url: '../addressList/addressList'
      });
    } else {
      wx.showModal({
        title: '用户未授权',
        content: '如需正常使用小程序功能，请按确定并且在【我的】页面中点击授权按钮，勾选用户信息并点击确定。',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
  }
})