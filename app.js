//app.js
var config = require('./config.js');
App({
	onLaunch: function() {

	},
  onShareAppMessage: function (query) {
	  console.log(query)
  },
	//显示消息提示框，1.5秒后消失，可以带执行函数，或许跳转路径
	showToast: function(msg, type = 'success', duration = 1500, url = '', success) {
		if (url != '') {
			wx.showToast({
				title: msg,
				icon: type,
				duration: duration,
				mask: true,
				success: function() {
					setTimeout(function() {
						wx.redirectTo({
							url: url
						})
					}, 2000)
				}
			})
		} else {
			if (success) {
				wx.showToast({
					title: msg,
					icon: type,
					duration: duration,
					mask: true,
					success: function() {
						success()
					}
				})
			} else {
				wx.showToast({
					title: msg,
					icon: type,
					duration: duration,
					mask: true
				})
			}
		}
	},
	//显示模态对话框，只有一个确定按钮，可以带执行函数
	showModal: function(content,title = '提示', success) {
		wx.showModal({
			title: title,
			content: content,
			showCancel: false,
      confirmColor: '#f8712d',
			success(res) {
				if (res.confirm) {
					if (success) {
						success();
					}
				}
			}
		})
	},
	//显示模态对话框，有确定和取消按钮，按钮文字可根据需要修改，可以带执行函数
  showConfirm: function (content, success, cancelText = '取消', confirmText = '确定', cancel, title = '提示') {
		wx.showModal({
      title: title,
			content: content,
			cancelText: cancelText,
			confirmText: confirmText,
			success(res) {
				if (res.confirm) {
					success();
				} else if (res.cancel) {
					if (cancel) {
						cancel();
					}
				}
			}
		})
	},
	//判断是否登录
	isLogin: function(cb) {
		var that = this;
		var token_type = wx.getStorageSync('token_type');
		var access_token = wx.getStorageSync('access_token');
		var timestamp = wx.getStorageSync('timestamp');
		let now = new Date().getTime();
		if (timestamp && token_type) {
			if (timestamp > now) {
				that.globalData.authorization = token_type + access_token;
				typeof cb == "function" && cb(that.globalData.authorization);
				return true;
			} else {
				wx.showModal({
					content: '登录超时，请重新登录',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							wx.reLaunch({
								url: '/pages/login/login'
							})
						}
					}
				})
			}
		} else {
			wx.showModal({
				content: '请先登录',
				showCancel: false,
				success: function(res) {
					if (res.confirm) {
						wx.reLaunch({
							url: '/pages/login/login'
						})
					}
				}
			})
			return false;
		}
	},
	// 更新用户信息

	userInfoUpdate(data, params) {

		let Authorization = data.token_type + data.access_token

		this.request(config.userInfoUpdate, "post", params, function(data) {
		  // console.log(data)
			if (data.success) {
				wx.reLaunch({
					url: '/pages/result/result'
				})
			} else {
				app.showModal(data.error.message)
			}
		}, function() {
			app.error()
		})

	},

	//登录成功过跳转
	loginSuccess: function(data) {
		var that = this;
		wx.removeStorageSync('access_token')
		wx.removeStorageSync('token_type')
		wx.removeStorageSync('timestamp')
		wx.setStorageSync('token_type', data.token_type)
		wx.setStorageSync('access_token', data.access_token)
		wx.setStorageSync('timestamp', new Date().getTime() + data.expires_in * 1000)
		wx.getUserInfo({
			success: function(res) {
			  // console.log(res)
				let params = {
					name: res.userInfo.nickName,
					avatar: res.userInfo.avatarUrl,
				}
				that.userInfoUpdate(data, params)
			},
      fail: res => {
			  console.log(res)
      }
		})
	},
	//不带加载框的ajax请求，适合页面有多个请求情况
	request: function(url, method, params, success, fail) {
		this.requestLoading(url, method, params, "", success, fail)
	},
	//带加载框的ajax请求
	requestLoading: function(url, method, params, message, success, fail) {
		wx.showNavigationBarLoading()
		if (message != "") {
			wx.showLoading({
				title: message,
			})
		}

    var token_type = wx.getStorageSync('token_type');
		var access_token = wx.getStorageSync('access_token');
    // var timestamp = wx.getStorageSync('timestamp');
    // let now = new Date().getTime();
    // if (timestamp && message != '登录中') {
    //   if (timestamp < now) {
    //     wx.showModal({
    //       content: '登录超时，请重新登录',
    //       showCancel: false,
    //       success: function(res) {
    //         if (res.confirm) {
    //           wx.reLaunch({
    //             url: '/pages/login/login'
    //           })
    //         }
    //       }
    //     })
    //   }
    // }
		let header = {
			'Authorization': token_type + access_token
		}
		wx.request({
			url: url,
			data: params,
			dataType: "json",
			header: header,
			method: method,
			success: function(res) {
				wx.hideNavigationBarLoading()
				if (message != "") {
					wx.hideLoading()
				}
				if (res.statusCode == 200) {
					success(res.data)
				} else {
					fail(res.data)
				}
			},
			fail: function(res) {
				wx.hideNavigationBarLoading()
				if (message != "") {
					wx.hideLoading()
				}
				wx.showModal({
					title: '提示',
					content: '发生错误，请稍后访问'
				})
				if (fail) {
					fail()
				}
			}
		})
	},
	error: function(url) {
		// wx.redirectTo({
		//   url: '/pages/error/index'
		// })
	},
	back: function(){
	  wx.navigateBack({
	    delta: 1
	  })
	},
	globalData: {
		authorization: null,
		extConfig: null
	}

})
