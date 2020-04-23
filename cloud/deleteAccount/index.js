const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
  console.log(event)
  const db = cloud.database()
  const { _id } = event

  return db.collection('account').where({ _id }).remove()
}
