var util = require("../../utils/util.js")
const QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'
let qrcode;
var app = getApp()

const qrcodeWidth = rpx2px(170)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: null, // 订单信息
    image: '',
    // 用于设置wxml里canvas的width和height样式
    qrcodeWidth: qrcodeWidth,
    imgsrc: '',
    phoneNumber: null,
    // hasDiscount: false,   //是否有优惠【默认无优惠】
    // discountMoney: 0,   //优惠价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log("onLoad():: ordersID = " + e.ordersID);
    var _this = this;
    var userInfo = app.globalData.userInfo;
    var preURL = app.globalData.preURL;
    wx.showLoading({
      title: '数据加载中...',
    })

    // 根据用户信息查找用户订单表
    if (userInfo) {
      wx.request({
        url: preURL + '/orders/get_one_orders_info/req',
        method: 'POST',
        data: {
          userObj: userInfo.id,
          ordersID: e.ordersID,
        },
        success: function (res) {
          console.log("订单详情：",res);
          var code = res.data.code;
          if (code === 0) {
            var arr = res.data.body;
            _this.setData({
              orders: arr,
              phoneNumber: res.data.body.shopInfo.shopTel,
            })
            wx.hideLoading();

            // 生成二维码
            qrcode = new QRCode('canvas', {
              usingIn: _this,
              // image: '/images/add.png',
              width: qrcodeWidth,
              height: qrcodeWidth,
              colorDark: "black",
              colorLight: "white",
              correctLevel: QRCode.CorrectLevel.H,
            });

            // 生成图片，绘制完成后调用回调
            qrcode.makeCode(arr.ordersId, () => {
              // 回调
              qrcode.exportImage(function (path) {
                _this.setData({
                  imgsrc: path
                })
              })
            })
          }
        }
      })
    }
  },

  /**
   * 打电话
   */
  callPhone: function(){
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.phoneNumber,
    })
  },

  /**
   * 确认收货
   */
  confirmReceipt: function(){

    var _this = this;

    if(null === _this.data.orders){
      return;
    }
    var ordersID = _this.data.orders.ordersId;
    var userInfo = app.globalData.userInfo;
    var preURL = app.globalData.preURL;

    wx.showModal({
      title: '确认收货',
      content: '确认收货后，该订单就完成了哦！',
      showCancel: true,
      success: function (res){
        if (res.confirm) {
          console.log('用户确定收货！');
          console.log('确认收货的订单号为：' + ordersID);
          wx.request({
            url: preURL + '/orders/confirm_receipt/update',
            method: 'POST',
            data: {
              userObj: userInfo.id,
              ordersID: ordersID,
            },
            success: function(data){
              console.log("修改结果：",data);
              var code = data.data.code;
              var receiptResult = data.data.body.updateFlag;
              if(code === 0){
                if(receiptResult === true){
                  // 跳转收货成功页面
                  wx.navigateTo({
                    url: '/pages/receiptSuccess/receiptSuccess',
                  })
                }
              } else {
                wx.showToast({
                  title: '系统异常',
                })
              }
            }
          })
        } else {
          console.log('用户取消确认收货！');
        }
      }
    })
  },

})