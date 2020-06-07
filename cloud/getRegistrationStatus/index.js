const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const getUsers = async () => {
  const rs = await cloud.database().collection('users').get()

  return rs.data
}

exports.main = async (event, context) => {
  const id = cloud.getWXContext().OPENID
  if (!id) { return '用户ID获取失败' }
  const users = await getUsers()
  const userExists = _.includes(_.map(users, '_openid'), id)

  if (!userExists) {
    return '用户未注册'
  }

  return _.find(users, ['_openid', id])
}