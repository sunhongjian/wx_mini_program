// pages/screen/screen.js
var app = getApp(),
  config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 1, // 切换class标志
    category: [{
      id: 1,
      name: "新闻"
    }, {
        id: 2,
      name: "开心一笑"
    }, {
        id: 3,
      name: "天气"
    }, {
        id: 4,
      name: "周边"
    }, {
        id: 5,
      name: "黄历查询"
      }, {
        id: 6,
      name: "图片笑话"
      }, {
        id: 7,
      name: "更多"
    }], // 筛选数据
    wHeight: 'height: calc(100vh - 70px);',
    sort: -1,
    sequence: true,
    option: {},
    FilterData: null,
    attributeStr: '',
    cover: '',
    productContent: '',
    fruitTypeList: [],
    fruitList: []
  },
  onLoad: function(opt) {

    app.isLogin(function(auth) {
      // console.log(auth)
    });

    this.getAttribute(opt)
    this.getCover();
    this.getOprogramOption();
    var FilterData = wx.getStorageSync('Categor_Filter');
    if (JSON.stringify(FilterData) !== "{}") {
      this.setData({
        FilterData: FilterData
      })
    }
    this.setData({
      option: opt,
      //
    })
  },
  /*
   * 设置分享
   * */
  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(res.target)
  //   }
  //   return {
  //     title: '邀请您使用',
  //     path: '/result/result?scene=' + this.data.userInfo.id
  //   }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let query = wx.createSelectorQuery();
    var FilterData = wx.getStorageSync('Categor_Filter');
    if (JSON.stringify(FilterData) !== "{}") {
      query.select('.selected').boundingClientRect(res => { //获取元素1距离页面顶部高度
        let wHeight = res.height + 70
        this.setData({
          wHeight: 'height: calc(100vh - ' + wHeight + 'px);'
        })
      }).exec()
    }
  },
  /*
   * 显示省略的全部内容
   */
  showContent(e) {
    console.log(e.currentTarget.dataset.text.length)
    if (e.currentTarget.dataset.text.length >= 15) {
      app.showModal(e.currentTarget.dataset.text, '')
    }
  },
  /*
   * 获取筛选过产品
   */
  getProduct(opt, sequence) {
    let params = {
      product_ids: opt.ids
    }
    if (this.data.sort !== -1) {
      params.sort = this.data.sort
    }
    if (sequence) {
      params.sequence = sequence
    }
    app.requestLoading(config.productUrl, 'post', params, '加载中', res => {
      if (res.success) {
        // let fruitType = {
        //   name: '空',
        //   is_sortable: -1
        // }
        let _this = this
        let attributeList = _this.data.attributeStr.split(',')
        res.result.product.map(
          item => {
            item.attribute_option.filter(
              option => {
                if (attributeList.indexOf(option.attribute_id.toString()) == -1) {
                  option.option_values = '无权限'
                  return option
                } else {
                  return option
                }
              }
            )
          }
        )
        // 每页数据最多显示15列, 后两列数据模糊
        let tempArr = []
        if (res.result.product.length > 17) {      
          for (let i = 0; i < 17; i++) {
            if (res.result.product[i]) {
              tempArr.push(res.result.product[i])
            }
          }
          wx.showModal({
            title: '提示',
            content: '本平台仅展示15列数据',
            showCancel: false,
            confirmText: "我知道了",
            confirmColor: '#f8712d'
          })
          console.log(tempArr)
        } else {
          tempArr = res.result.product
        }
        this.setData({
          fruitTypeList: res.result.attribute,
          fruitList: tempArr
        })
      } else {
        app.showModal(res.error.message)
      }
    }, function() {
      app.error()
    })
  },
  /**
   * 获取遮盖层
   */

  getCover() {
    app.request(config.coverUrl, 'get', {}, res => {
      if (res.success) {
        this.setData({
          cover: res.result
        })
      } else {}
    })
  },
  /*
   * 获取小程序信息
   * */
  getOprogramOption() {
    let params = {}
    app.requestLoading(config.programOptionUrl, 'get', params, '加载中', res => {
      if (res.success) {
        this.setData({
          productContent: res.result.products_content
        })
      } else {
        app.showModal(res.error.message)
      }
    }, function() {
      app.error()
    })
  },
  /*
   * 查询（不）可显示选项ids
   */
  getAttribute(opt) {
    let params = {
      viewable: 1,
    }
    app.request(config.attributeUrl, 'post', params, res => {
      if (res.success) {
        this.setData({
          attributeStr: res.result
        })
        this.getProduct(opt)
      } else {
        app.showModal(res.error.message)
      }
    }, function() {
      app.error()
    })
  },
  /*
   * 统一跳转函数
   * */
  navTo(e) {
    if (e.target.dataset.type == 'redirect') {
      wx.redirectTo({
        url: e.target.dataset.url
      })
    } else if (e.target.dataset.type == 'back') {
      wx.navigateBack()
    } else {
      wx.navigateTo({
        url: e.target.dataset.url
      })
    }
  },
  /*
   *返回之前页面
   */
  navBack() {
    wx.navigateBack()
  },
  /*
   * 客服回调函数
   * */
  handleContact(e) {
    console.log(e)
  },
  // 顶部过滤方法
  handleSort(e) {
    this.setData({
      flag: e.currentTarget.dataset.flagindex
    });
  },
  /*
   * 排序
   * */
  cellSort(e) {
    console.log(e.currentTarget.dataset.item)
    if (e.currentTarget.dataset.item.is_sortable != -1) {
      this.setData({
        sort: e.currentTarget.dataset.item.id
      })
      let sequence = e.currentTarget.dataset.item.sequence
      this.getProduct(this.data.option, sequence)
    }

  }
})