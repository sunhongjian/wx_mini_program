// pages/my/my.js
var app = getApp(),
  config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo: {},
      programOption: {},
      hascontcat: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getUserInfo();
      this.getOprogramOption();
  },
  /*
  * 设置分享
  * */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let url = '/pages/result/result?scene=' + this.data.userInfo.id
    let data = {
      title: this.data.programOption.share_title,
      path: url
    }
    if (this.data.programOption.share_image !== '') {
      data.imageUrl = this.data.programOption.share_image
    }
    return data
  },

  /*
  * 图片预览
  * */
  previewImg:function(e){
    /*console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;*/
    var imgArr = [this.data.userInfo.user_auth[0].spread_qr_code]

    var imgUrl =
    wx.previewImage({
      current: imgUrl,     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /*
  * 获取用户信息
  * */
  getUserInfo () {
    let params = {}
    app.requestLoading(config.userInfoUrl, 'get', params, '加载中', res => {
      if (res.success) {
        this.setData({
          userInfo: res.result
        })
      } else {
        app.showModal(res.error.message)
      }
    }, function() {
      app.error()
    })
  },

  /*
  * 获取小程序信息
  * */
  getOprogramOption () {
    let params = {}
    app.requestLoading(config.programOptionUrl, 'get', params, '加载中', res => {
      if (res.success) {
        this.setData({
          programOption: res.result
        })
      } else {
        app.showModal(res.error.message)
      }
    }, function() {
      app.error()
    })
  },
  /*
  * 保存图片
  * */
  saveImg () {
    wx.getSetting({
      success: function (res) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function (res) {
            console.log("授权成功");
            var imgUrl = this.data.userInfo.user_auth[0].spread_qr_code
            wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
              url: imgUrl,
              success: function (res) {
                // 下载成功后再保存到本地
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                  success: function (res) {
                    wx.showToast({
                      title: '成功保存到相册',
                      icon: 'success'
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },

  /*
  * 客服回调函数
  * */
  handleContact (e) {
      console.log(e)
  },
  /*
  * 关闭弹出框
  * */
  contactHide () {
    this.setData({
      hascontcat: false
    })
  },

  /*
  * 显示弹出框
  * */
  contactShow () {
    this.setData({
      hascontcat: true
    })
  },

  /*
	 * 统一跳转函数
	 * */
  navTo (e) {
    if (e.target.dataset.type == 'redirect') {
      wx.redirectTo({
        url: e.target.dataset.url
      })
    }
  },
})
