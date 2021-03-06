// pages/screen/screen.js
var app = getApp(),
  config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true,
    yList: [],
    yixuan: [],
    weixuan: [],
    showAll: false,
    wHeight: '',
    attribute_id: '',
    phoneList: [], // 电话列表
    showModal: false,
    flag: 0, // 切换class标志
    category: [], // 筛选数据
    checkColums: [{
        id: 1,
        name: '产品名称'
      },
      {
        id: 2,
        name: '资方名称'
      }
    ], // 已选头部
    checkData: [],
    sort: '',
    sequence: true,
    option: {},
    FilterData: null,
    attributeStr: '',
    cover: '',
    productContent: '',
    fruitTypeList: [],
    fruitList: [],

    // 当前的名称
    dq_name: "已选",
    // 滚动条的高度
    scrollTop:0,
  },
  onLoad: function(opt) {
    app.isLogin(function(auth) {
      // console.log(auth)
    });
    // 二期新增功能,调用排序接口
    this.getSelected()
    this.getSortList()
    // this.getAttribute(opt)
    // this.getCover();
    // this.getOprogramOption();
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
  // 滚动时执行
  scroll_change_fun(e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  /*
   * 显示省略的全部内容
   */
  showText(e) {
    if (e.currentTarget.dataset.text.length > 6) {
      app.showModal(e.currentTarget.dataset.text, '')
    }
  },
  //筛选结果 - 已选
  getSelected() {
    var Params_Filter = wx.getStorageSync('Params_Filter');
    // var attribute_id = wx.getStorageSync('attribute_ids');
    // let params = {
    //   option_id: FilterData,
    //   attribute_id,
    //   attribute_ids: this.data.attribute_id,
    //   sort: this.data.sort
    // }
    Params_Filter.sort = this.data.sort
    Params_Filter.attribute_id = this.data.attribute_id
    app.requestLoading(config.selectUrl, 'get', Params_Filter, "", res => {
      this.setData({
        loadingHidden: false
      })
      if (res.success) {
        this.setData({
          weixuan: res.result.weixuan,
          yixuan: res.result.yixuan[0].option,
          yList: res.result.yixuan
        })
        // 当li与title相交时触发
        wx.createIntersectionObserver(this).relativeTo('#biao_zhi').observe("#yi_xuan", (res) => {
          if (res.intersectionRatio != 0) {
            // 更新数据
            this.setData({
              dq_name: "已选"
            })
          }
        })

        for (var i = 0; i < this.data.weixuan.length; ++i) {
          // li的id
          let li_id = "#li-" + i;
          // 当li与title相交时触发
          wx.createIntersectionObserver(this).relativeTo('#biao_zhi').observe(li_id, (res) => {
            if (res.intersectionRatio != 0) {
              // 获取li的下标
              let index = res.id.split("-")[1];
              let dq_name = this.data.weixuan[index].name;
              // 更新数据
              this.setData({
                dq_name: dq_name
              })
            }
          })
        }
      } else {
        app.showModal(res.error.message)
      }
    }, function() {
      app.error()
    })
  },
  // 获取排序列表
  getSortList() {
    let params = {}
    app.requestLoading(config.sortUrl, 'get', params, '加载中', res => {
      if (res.success) {
        res.result.unshift({
          id: 0,
          title: "综合排序",
          attribute_id: '',
          sort: ""
        })
        this.setData({
          category: res.result
        })
      } else {
        app.showModal(res.error.message)
      }
    }, function() {
      app.error()
    })
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
        // 每页数据最多显示15列, 后两列数据模糊
        let tempArr = []
        if (res.result.product.length > 17) {
          for (let i = 0; i < 17; i++) {
            if (res.result.product[i]) {
              tempArr.push(res.result.product[i])
            }
          }
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
      flag: e.currentTarget.dataset.flagindex,
      sort: e.currentTarget.dataset.sort,
      attribute_id: e.currentTarget.dataset.attr
    });
    this.getSelected()
  },
  submit(event) {
    if (event.currentTarget.dataset.index > 14) {
      return false
    }
    let phoneList = event.currentTarget.dataset.phone
    console.log(phoneList)
    this.setData({
      showModal: true,
      phoneList: phoneList ? phoneList : []
    })
  },
  preventTouchMove: function() {

  },
  go: function() {
    this.setData({
      showModal: false
    })
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

  },
  // 拨打电话
  callHandle(e) {
    console.log(e.currentTarget.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  // 展开全部
  toggleAll() {
    this.setData({
      showAll: !this.data.showAll
    })
  }
})