// 导入地区信息
var area = require('../../utils/area.js');
var areaInfo = []; //所有省市区县数据
var provinces = []; //省
var provinceNames = []; //省名称
var citys = []; //城市
var cityNames = []; //城市名称
var countys = []; //区县
var countyNames = []; //区县名称
var value = [0, 0, 0]; //数据位置下标
var addressList = null;

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    transportValues: ["收货时间不限", "周六日/节假日收货", "周一至周五收货"],
    transportIndex: 0,
    provinceIndex: 0, //省份
    cityIndex: 0, //城市
    countyIndex: 0, //区县
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this;
    area.getAreaInfo(function(arr) {
      areaInfo = arr;
      //获取省份数据
      that.getProvinceData();
    });
  },

  // 获取省份数据
  getProvinceData: function() {
    var that = this;
    var s;
    provinces = [];
    provinceNames = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
      s = areaInfo[i];
      if (s.di == "00" && s.xian == "00") {
        provinces[num] = s;
        provinceNames[num] = s.name;
        num++;
      }
    }
    that.setData({
      provinceNames: provinceNames
    })

    that.getCityArr();
    that.getCountyInfo();
  },

  // 获取城市数据
  getCityArr: function(count = 0) {
    var c;
    citys = [];
    cityNames = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
      c = areaInfo[i];
      if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
        citys[num] = c;
        cityNames[num] = c.name;
        num++;
      }
    }
    if (citys.length == 0) {
      citys[0] = {
        name: ''
      };
      cityNames[0] = {
        name: ''
      };
    }
    var that = this;
    that.setData({
      citys: citys,
      cityNames: cityNames
    })
    // console.log('cityNames:' + cityNames);
    that.getCountyInfo(count, 0);
  },

  // 获取区县数据
  getCountyInfo: function(column0 = 0, column1 = 0) {
    var c;
    countys = [];
    countyNames = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
      c = areaInfo[i];
      if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
        countys[num] = c;
        countyNames[num] = c.name;
        num++;
      }
    }
    if (countys.length == 0) {
      countys[0] = {
        name: ''
      };
      countyNames[0] = {
        name: ''
      };
    }
    // console.log('countyNames:' + countyNames);
    var that = this;
    // value = [column0, column1, 0];

    that.setData({
      countys: countys,
      countyNames: countyNames,
      // value: value,
    })
  },

  // 运输时间改变 
  bindTransportDayChange: function(e) {
    // console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      transportIndex: e.detail.value
    })
  },

  // 省名称改变
  bindProvinceNameChange: function(e) {
    var that = this;
    // console.log('picker province 发生选择改变，携带值为', e.detail.value);
    var val = e.detail.value
    that.getCityArr(val); //获取地级市数据
    that.getCountyInfo(val, 0); //获取区县数据

    value = [val, 0, 0];
    this.setData({
      provinceIndex: e.detail.value,
      cityIndex: 0,
      countyIndex: 0,
      value: value
    })
  },

  // city名称改变
  bindCityNameChange: function(e) {
    var that = this;
    // console.log('picker city 发生选择改变，携带值为', e.detail.value);

    var val = e.detail.value
    that.getCountyInfo(value[0], val); //获取区县数据
    value = [value[0], val, 0];
    this.setData({
      cityIndex: e.detail.value,
      countyIndex: 0,
      value: value
    })
  },

  // 区域名称改变
  bindCountyNameChange: function(e) {
    var that = this;
    // console.log('picker county 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countyIndex: e.detail.value
    })
  },

  // 保存地址信息（同步到数据中）
  saveAddress: function(e) {

    // 获取输入框中的数据
    var consignee = e.detail.value.consignee;
    var mobile = e.detail.value.mobile;
    var transportDay = e.detail.value.transportDay;
    var provinceName = e.detail.value.provinceName;
    var cityName = e.detail.value.cityName;
    var countyName = e.detail.value.countyName;
    var address = e.detail.value.address;

    // 获取缓存数据
    var arr = wx.getStorageSync('addressList') || [];
    // console.log("用户地址缓存数组：arr,{}", arr);
    addressList = {
      consignee: consignee,
      mobile: mobile,
      address: provinceName + cityName + countyName + address,
      transportDay: transportDay,
      idDefaultAddress: false
    }
    arr.push(addressList);
    // wx.setStorageSync('addressList', arr);

    // 同步到数据库中
    var preURL = app.globalData.preURL;
    var userObj = app.globalData.userInfo.id;

    if(arr.length > 0){
      wx.request({
        url: preURL + '/address/add_user_address/add',
        method: 'POST',
        data:{
          userObj: userObj,
          consigneeInfos: arr,
        },
        success: function(res){
          // console.log("保存后的地址："+res);
          // 成功后，将有地址主键的地址放到缓存中
          wx.setStorageSync('addressList', res.data.body);
          // 添加数据后返回
          wx.navigateBack({})
        },
        fail: function(){
          wx.showToast({
            title: '保存失败！',
            duration: 1300,
          })
        }
      })
    }
  }
})