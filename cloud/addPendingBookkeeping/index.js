const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
  const _openid = cloud.getWXContext().OPENID
  const db = cloud.database()

  return db.collection('pending_pocketbook_list').add({
    data: { _openid, ...event }
  })
}