const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const _openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  const command = db.command
  const user = await db.collection('users').where({
    _openid,
  }).get()
  const rs = await db.collection('bookkeeping_type').where({
    _id: command.in(user.data[0].bookkeepingTypes)
  }).get()
  const list = _.sortBy(rs.data, 'sort');

  return list
}
