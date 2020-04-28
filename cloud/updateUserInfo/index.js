const _ = require('lodash')
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
  const _openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  const { bookkeepingTypes } = event

  return db.collection('users').where({ _openid }).update({
    data: { bookkeepingTypes },
  })
}