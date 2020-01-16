// pages/result/result.js
var app = getApp(),
  defaultParams = {}, // 保存默认筛选项
  config = require('../../config.js');
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    news: ['平台更新万向数据库数据批量更新批量平台更 新万向数据库更新万向数据库平台更新万向数据库数据批量更新批量平台更 新万向数据库更新万向数据库平台更新万向数据库数据批量更新批量平台更 新万向数据库更新万向数据库平台更新万向数据库数据批量更新批量平台更 新万向数据库更新万向数据库平台更新万向数据库数据批量更新批量平台更 新万向数据库更新万向数据库平台更新万向数据库数据批量更新批量平台更 新万向数据库更新万向数据库', '祝贺新系统成功上线', '新年快乐'], // 消息数组
    movies: [
      { url: 'http://static.runoob.com/images/demo/demo4.jpg' },
      { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSBlzF4v4_Ao3tPG22KxDTnhCEpHET4z7RZUdv9MVUStSqPY6F-' },
      { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSeKnR2W70kYmndELJ9tWdag6IVgS2H1Pp2xAzEmcR334OfA_Lq' },
      { url: 'http://pic1.win4000.com/wallpaper/2/5911208a1ab3a.jpg' }
    ],
    activeCol: 'name1', // 默认打开的
    minAnimationData: {}, // 左侧滑块动画
    maxAnimationData: {}, // 右侧滑块动画
    startX: {}, // 左侧滑块 开始滑动距离左侧距离
    endX: {}, // 右侧滑块 开始滑动距离左侧距离
    step: {}, // 滑竿线可以每块多少像素 如总长240px 分成24块，每块240/23像素，为什么是23？大家自己思考咯，可以留言
    startStep: {}, // 左侧滑块初始位置
    endStep: {}, // 右侧滑块初始位置
    amountW: '220', // 滑竿多长距离
    leftValue: 0,
    rightValue: 6,
    leftWidth:'50',
    rigthWidth: '50',
    sliderMin: 0, //滑块最小值
    sliderMax: 10000, //滑块最大值
    sliderValue: 1000, //滑块默认值
    nList: [],
    hasLogin: false,
    isReq: true, // 筛选按钮选择是否展示
    tabIndex: 1, // Tab 选中下标
    count: 0,
    ids: '',
    requiredList: [],
    allRequiredList: [],
    programOption: {},
    userInfo: {},
    SelectData: {},
    params: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.scene) {
      /*
       * 有推荐人的话
       * 保存推荐人信息
       * */
      wx.removeStorageSync('inviter_id')
      wx.setStorageSync('inviter_id', options.scene)
    }
    let _this = this
    app.isLogin(function(auth) {
      // console.log(auth)
      _this.getOprogramOption();
      _this.hasLogin = true
    });

    this.getCategory();
    this.getUserInfo()
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
    console.log(this.data.programOption.share_image)
    if (this.data.programOption.share_image !== '') {
      data.imageUrl = this.data.programOption.share_image
    }
    return data
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
        if (res.result.is_notice) {
          wx.showModal({
            title: '温馨提示',
            content: '哪里有问题点哪里，无必选项',
            cancelText: '不再提示',
            confirmText: '确定',
            confirmColor: '#000000',
            success(res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                app.requestLoading(config.userUrl + '/set_notice', 'post', params, '加载中', res => {
                })
              }
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
  * 客服回调函数
  * */
  handleContact (e) {
      console.log(e)
  },
  /*
   * 点击显示
   * */
  selectShow(e) {
    let string = "nList[" + e.currentTarget.dataset.index + "].attribute[" + e.currentTarget.dataset.attrindex + "].selected"
    this.setData({
      [string]: !this.data.nList[e.currentTarget.dataset.index].attribute[e.currentTarget.dataset.attrindex].selected
    })
  },
  /*
   * 单选点击事件
   * */
  checkChange(e) {

    // let attributeList = this.data.nList[e.currentTarget.dataset.index]
    let data = this.data.nList[e.currentTarget.dataset.index].attribute[e.currentTarget.dataset.attrindex]
    let string = "nList[" + e.currentTarget.dataset.index + "].attribute[" + e.currentTarget.dataset.attrindex + "].option"
    let o = this.data.nList[e.currentTarget.dataset.index].attribute[e.currentTarget.dataset.attrindex]
    let arr = this.data.requiredList
    if (data.relation_ids != '') {
      // 当有必填项时，往数组里添加
      let requiredList = this.data.requiredList
      let relation = data.relation_ids.split(',')
      if (requiredList.length) {
        arr = [...relation,...requiredList]
        console.log(arr)
        arr = Array.from(new Set(arr))
      } else {
        arr = requiredList.concat(relation)
      }
      this.setData({
        allRequiredList: JSON.parse(JSON.stringify(arr))
      })
    } else {
        // 没有时判断是否是必选项
        let s = String(data.id)
        let index = arr.indexOf(s)
        if (index === -1) {} else {
          arr.splice(index, 1)
        }
        
    }

    this.setData({
        requiredList: arr
    })
    o.option.map(item => {
      item.selected = false
    })
    o.option[e.currentTarget.dataset.optionindex].selected = true
    delete this.data.SelectData[data.id]
    this.data.SelectData[data.id] = {
      category: data.name,
      value: e.currentTarget.dataset.option.name
    }
    this.data.params[data.id] = {
      text: e.currentTarget.dataset.option.name,
      option_id: e.currentTarget.dataset.option.id
    }
    // console.log(arr)
    this.setData({
      [string]: o.option,
      params: this.data.params,
      SelectData: this.data.SelectData
    })
    this.isFillter()
    // this.getFilter()
  },
  /*
   * 多选选择
   * */
  selectChange: function(e) {
    let data = this.data.nList[e.currentTarget.dataset.index].attribute[e.currentTarget.dataset.attrindex]
    let string = "nList[" + e.currentTarget.dataset.index + "].attribute[" + e.currentTarget.dataset.attrindex + "].option[" + e.currentTarget.dataset.optionindex + "].selected"
    let o = this.data.nList[e.currentTarget.dataset.index].attribute[e.currentTarget.dataset.attrindex].option[e.currentTarget.dataset.optionindex].selected
    o = !o
    let option_id = []
    let text = []
    if (this.data.params[data.id]) {
          option_id = this.data.params[data.id].option_id.split(',')
          text = this.data.params[data.id].text.split(',')
    }
    let t = ''
    if (o) {
      // 当未选中的时候
      text.push(e.currentTarget.dataset.option.name)
      option_id.push(e.currentTarget.dataset.option.id)
      this.data.params[data.id] = {
        text: text.toString(),
        option_id: option_id.toString()
      }
      this.data.SelectData[data.id] = {
        category: data.name,
        value: text.toString()
      }
    } else {

      if (text.length == 1) {
        // 多选已选中的时候， 取消选择
        this.data.params[data.id] = {
          text: '不限',
          option_id: ''
        }
        delete this.data.SelectData[data.id]
      } else {
        // 多选选择
        text.splice(text.indexOf(e.currentTarget.dataset.option.name), 1)
        option_id.splice(option_id.indexOf(e.currentTarget.dataset.option.id), 1)
        this.data.params[data.id] = {
          text: text.toString(),
          option_id: option_id.toString()
        }
        this.data.SelectData[data.id] = {
          category: data.name,
          value: text.toString()
        }
      }
    }

    this.setData({
      [string]: o,
      params: this.data.params,
      SelectData: this.data.SelectData
    })
    this.getFilter()
  },
  /*
   * 获取筛选 项目
   */
  getCategory() {
    let _this = this
    app.request(config.categoryUrl, 'get', {
      module: this.data.tabIndex
    }, res => {
      if (res.success) {
        let data = res.result.filter(it => it.attribute.length > 0)
        this.setData({
          nList: data,
        })
        // setTimeout(function() {
        //   // _this.getFilter()
        //   _this.isFillter()
        // }, 100);
        _this.isFillter()
      } else {
        app.showModal(res.error.message)
      }
    }, function() {
      app.error()
    })
  },
  /*
   * 取消必填项变红
   */
  cancelRequired(arr, arg, arrName) {
      let index = arr.indexOf(arg)
      arr.splice(index, 1)
      this.setData({
        [arrName]: arr
      })
  },
  /*
   *  获取筛选前的判断
   */
  isFillter () {
      var k = Object.keys(this.data.params)
      let requiredList = this.data.requiredList
      let _this = this
      let isReq = true
      this.data.allRequiredList.map(item => {    
        if (k.indexOf(item) === -1) {
          isReq = false 
          return false
        } else if (requiredList.indexOf(item) !== -1) {
          _this.cancelRequired(requiredList, item, 'requiredList')
        }
      })
      // console.log(isReq)
      if (this.data.isReq === isReq) {} else {
        this.setData({
          isReq: isReq,
        })
      }
      
      if (isReq) {
        // console.log('我要请求了')
        this.getFilter()
      } else {
        // console.log('有必填项')
      }
      
  },

  /*
   * 获取筛选过的项目
   */
  getFilter() {
    let _this = this
    let params = {
      params: this.data.params,
      module: this.data.tabIndex
    }
    this.data.nList.map(it => 
      it.attribute.map(c => { 
          if(c.type == 5 && !this.data.params[c.id]) { 
            c.option.forEach(o => {
              // console.log(!c.key_name)
              if (!o.key_name) {
                params.params[c.id] = {
                  key_name: o.key_name,
                  option_id: o.id
                }
              }
            })
          }
      }) 
    ) 
    app.request(config.productFilterUrl, 'post', params, res => {
      if (res.success) {
        this.setData({
          count: res.result.count,
          ids: res.result.ids
        })
        wx.removeStorageSync('Categor_Filter')
        wx.setStorageSync('Categor_Filter', this.data.SelectData)
      } else {
        app.showModal(res.error.message)
      }
    }, error => {
      // app.showModal('请求失败')  
    })
  },
  /*
   * 单项清除
   * */
  itemReset(e) {
    let data = this.data.nList[e.currentTarget.dataset.index].attribute[e.currentTarget.dataset.attrindex]
    let string = "nList[" + e.currentTarget.dataset.index + "].attribute[" + e.currentTarget.dataset.attrindex + "].option"
    let requiredList = this.data.requiredList.filter(item => data.relation_ids.indexOf(item) === -1)
    let allRequiredList = this.data.allRequiredList.filter(item => data.relation_ids.indexOf(item) === -1)
    // console.log(data.relation_ids)
    allRequiredList.map(item => {
        // 当清除项为必填项是把当前项添加到requiredList
        if (item == data.id && requiredList.indexOf(item) === -1) {
            console.log(item)
            requiredList.push(item)
        }
    })
    data.option.map(item => {
      item.selected = false
    })
    delete this.data.params[data.id]
    delete this.data.SelectData[data.id]
    this.setData({
      [string]: data.option,
      params: this.data.params,
      requiredList:requiredList,
      allRequiredList: allRequiredList,
      SelectData: this.data.SelectData
    })
    this.isFillter()
  },
  /*
   * 重置筛选项
   */
  ResetFilter() {
    this.getCategory()
    this.setData({
      params: {},
      requiredList: [],
      allRequiredList: [],
      SelectData: {}
    })
  },

  /*
   * 统一跳转函数
   * */
  navTo(e) {
    console.log(this.data.isReq)
    if (this.data.isReq) {
      if (this.data.count || e.target.dataset.type == 'redirect') {
        wx.navigateTo({
          url: e.target.dataset.url
        })
      } else {
        app.showModal('这个真没有。。。放宽筛选条件或联系我们可以有')
      }
    } else {
      app.showModal('请先选择红色必选项')
    }
    
  },
  /*
   * Tab 切换函数
   * */
  tabClick(e) {
    this.setData({
      tabIndex: this.data.tabIndex == 1 ? 2 : 1
    })
    this.ResetFilter()
  },
  /*
  * 滑块监听函数
  */
  onRangeChange (e) {
      let data = e.detail.options
      let text = ''
      let title = ''
      if (e.detail.minValue == e.detail.maxValue) {
        text = e.detail.minValue
      } else {
        text = e.detail.minValue + ' - ' + e.detail.maxValue
      }
      if (data.max == e.detail.maxValue && data.min == e.detail.minValue) {
        title = '不限'
      } else if(e.detail.minValue == e.detail.maxValue){
        title = e.detail.minValue
      } else {
        title = e.detail.minValue + ' - ' + e.detail.maxValue
      }
      let params  = {
        title: title,
        text: text,
        begin: e.detail.minValue,
        end: e.detail.maxValue
      }
      this.data.SelectData[data.id] = {
        category: data.name,
        value: params.begin + '-' + params.end + data.unit
      }
      this.data.params[data.id] = params
      this.setData({
        params: this.data.params,
        SelectData: this.data.SelectData
      })
      this.getFilter()
  },
  /**
   * switch开关监听函数
   */
  switchChange (e) {
      console.log(e)
      let data = e.currentTarget.dataset.option
      let params = {}
      let value = ''
      data.option.map(o => {
        if (e.detail.value == o.key_name) {
          params = {
              key_name: o.key_name,
              option_id: o.id
          }
          value = o.name
        }
      })
      this.data.SelectData[data.id] = {
        category: data.name,
        value: value
      }
      this.data.params[data.id] = params
      this.setData({
        params: this.data.params,
        SelectData: this.data.SelectData
      })
      this.getFilter()
      // console.log(params)
  }


})