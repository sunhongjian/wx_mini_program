var app = getApp(),
  defaultParams = {}, // 保存默认筛选项
  config = require('../../config.js');
// pages/banner/banner.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    richText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    app.request(`${config.bannerDetailUrl}${options.id}`, 'get', {
    }, res => {
      if (res.success) {
        this.setData({
          richText: res.result.detail,
        })
      } else {
        app.showModal(res.error.message)
      }
    }, function () {
      app.error()
    })
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