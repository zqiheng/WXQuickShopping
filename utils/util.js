const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 请求后台加载最近商店
 */
function findTheNearByShop(preURL, longitude, latitude, callBack) {
  wx.request({
    url: preURL + '/find_specify_shop_by_position',
    method: 'POST',
    data: {
      longitude: longitude,
      latitude: latitude,
    },
    success: function(res) {
      callBack(res);
    },
    fail: function() {
      wx.showToast({
        title: '获取店铺失败',
        duration: 1500,
      })
    }
  })
}

//获取用户地理位置权限
function getPermission(callBack) {
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success: function(res) {
      callBack(res);
    },
    fail: function() {
      wx.getSetting({
        success: function(res) {
          var statu = res.authSetting;
          if (!statu['scope.userLocation']) {
            wx.showModal({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置，请确认授权，否则功能将无法使用',
              success: function(tip) {
                if (tip.confirm) {
                  wx.openSetting({
                    success: function(data) {
                      if (data.authSetting["scope.userLocation"] === true) {
                        // wx.showToast({
                        //   title: '授权成功',
                        //   icon: 'success',
                        //   duration: 1000
                        // })
                        //授权成功之后，再调用getLocation选择地方
                        wx.getLocation({
                          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                          success: function(res) {
                            callBack(res);
                          },
                        })
                      } else {
                        // wx.showToast({
                        //   title: '授权失败',
                        //   icon: 'success',
                        //   duration: 1000
                        // })
                      }
                    }
                  })
                }
              }
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '调用授权窗口失败',
            icon: 'success',
            duration: 1000
          })
        }
      })
    }
  })
}

// 获取所有商品信息的方法
function getProductInfo(preURL, shopObj, result) {
  // 发起后台商品信息请求
  wx.request({
    url: preURL + '/product/get_all_product_infos/req',
    method: "POST",
    data: {
      shopObj: shopObj,
    },
    // 成功
    success: function(res) {
      var items = res.data.body;
      result(items);
    },
    // 失败
    fail: function() {
      console.log("访问错误，请稍后再试...");
    }
  })
}

/**
 * 提示信息
 */
function tipsInfo() {
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

/*
 * 判断obj是否为一个整数
 */
function isInteger(obj) {
  return Math.floor(obj) === obj
}

/**
 * toInteger
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *  {times:100, num: 314}
 */
function toInteger(floatNum) {
  var ret = {
    times: 1,
    num: 0
  }
  if (isInteger(floatNum)) {
    ret.num = floatNum
    return ret
  }
  var strfi = floatNum + ''
  var dotPos = strfi.indexOf('.')
  var len = strfi.substr(dotPos + 1).length
  var times = Math.pow(10, len)
  var intNum = parseInt(floatNum * times + 0.5, 10)
  ret.times = times
  ret.num = intNum
  return ret
}

/**
 * 乘法:multiply【解决微信小程序计算精度不准确的方法】
 */
function multiply(a, b) {
  var o1 = toInteger(a)
  var o2 = toInteger(b)
  var n1 = o1.num
  var n2 = o2.num
  var t1 = o1.times
  var t2 = o2.times
  var max = t1 > t2 ? t1 : t2
  var result = null
  result = (n1 * n2) / (t1 * t2)
  return result
}

/**
 * 除法：divide
 */
function divide(a, b) {
  var o1 = toInteger(a)
  var o2 = toInteger(b)
  var n1 = o1.num
  var n2 = o2.num
  var t1 = o1.times
  var t2 = o2.times
  var max = t1 > t2 ? t1 : t2
  var result = null
  result = (n1 / n2) * (t2 / t1)
  return result
}


module.exports = {
  formatTime: formatTime,
  findTheNearByShop: findTheNearByShop,
  getPermission: getPermission,
  getProductInfo: getProductInfo,
  tipsInfo: tipsInfo,
  multiply: multiply,
  divide: divide
}