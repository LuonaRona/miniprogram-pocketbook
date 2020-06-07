const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
  const _openid = cloud.getWXContext().OPENID
  const db = cloud.database()

  if (_.isNil(event._id)) {
    return db.collection('account').add({
      data: { ...event, _openid }
    })
  } else {
    const { name, balance, bgColor, description, iconPath } = event
    return db.collection('account').doc(event._id).update({
      data: { _openid, name, balance, bgColor, description, iconPath }
    })
  }
}