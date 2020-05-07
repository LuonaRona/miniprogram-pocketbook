const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = () => {
  const _openid = cloud.getWXContext().OPENID
  const db = cloud.database()

  return db.collection('pending_pocketbook_list').where({ _openid }).get()
}
