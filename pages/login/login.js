// pages/login/login.js
var app = getApp(),
	config = require('../../config.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    userButton: true,
    inviter_id: 0,
    protocolCheck: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
    var that = this;
    var inviter_id = wx.getStorageSync('inviter_id');
    if (inviter_id) {
      this.setData({
        inviter_id: inviter_id
      })
    }
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            userButton: false
          })
        }
      }
    })
    this.isLogin();
	},
  isLogin: function () {
    var that = this;
    var token_type = wx.getStorageSync('token_type');
    var access_token = wx.getStorageSync('access_token');
    var timestamp = wx.getStorageSync('timestamp');
    let now = new Date().getTime();
    if (timestamp && token_type) {
      if (timestamp > now) {
        wx.reLaunch({
          url: '/pages/result/result'
        })
      }
    }
  },
  checkboxChange (e) {
    console.log(e.detail.value.length)
    let check = false
    if(e.detail.value.length) {
      check = true
    }
    this.setData({
      protocolCheck: check
    })
  },
  agreeProtocol () {
    app.showModal('请阅读并同意以下服务协议')
  },
	/**
	 * 微信一键登录
	 */
	wxCheck: function() {
		var that = this

		wx.login({
			success: function(res) {
				var code = res.code
				var paramer = {
					code: code
				}
				if (that.data.inviter_id !== 0) {
				  paramer.inviter_id = that.data.inviter_id
        }
				app.requestLoading(config.loginUrl, 'get' , paramer, '登录中', function(data) {
					if (data.success) {
						app.showToast('登录成功')
						app.loginSuccess(data.result)
					} else{
						app.showModal(data.error.message)
					}
				}, function() {
					app.error()
				})
			},
			fail: function() {
				app.showModal('微信登录失败')
			}
		})
	},
	//微信授权
	onGotUserInfo: function(e) {
		var that = this;
		that.wxCheck();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
