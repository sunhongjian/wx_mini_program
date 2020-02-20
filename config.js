var host = 'wxapi.meisenlianchuang.com'
var config = {
  // 登录地址，用于获取Key
  loginUrl: `https://${host}/api/login`,
  // 更新用户信息地址， 用于更新用户个人信息
  userInfoUpdate: `https://${host}/api/user/update`,
  // 获取用户信息接口
  userInfoUrl: `https://${host}/api/user/show`,
  // 获取小程序信息接口
  programOptionUrl: `https://${host}/api/mini_program_option`,
  // 筛选页筛选项目
  categoryUrl: `https://${host}/api/category/index`,
  // 根据ids查询产品
  productUrl: `https://${host}/api/product/index`,
  // 已选
  selectUrl: `https://${host}/api/product/selected`,
  // 未选
  selectednotUrl: `https://${host}/api/product/selectednot`,
  // 查询（不）可显示选项ids
  attributeUrl: `https://${host}/api/attribute/index`,
  // 获取遮盖层
  coverUrl: `https://${host}/api/cover`,
  // 筛选ids
  productFilterUrl: `https://${host}/api/product/num`,
  // 登出
  logoutUrl: `https://${host}/api/logout`,
  // 通用接口
  userUrl: `https://${host}/api/user`,
  // 二期开发新增
  // 排序列表
  sortUrl: `https://${host}/api/sort/index`,
  // 信息更新
  messageUrl: `https://${host}/api/message/index`,
  // 轮播图
  bannerUrl: `https://${host}/api/banner/index`,
  // 轮播图详情
  bannerDetailUrl: `https://${host}/api/banner/detail/`,
};

module.exports = config
