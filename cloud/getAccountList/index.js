const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async () => {
  const _openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  const rs = await db.collection('account').where({ _openid }).get()

  return  _.sortBy(rs.data, 'timestamp')
}
