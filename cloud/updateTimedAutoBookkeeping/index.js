const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
  const db = cloud.database()
  const { _id, disable } = event
  
  return db.collection('pending_pocketbook_list').where({ _id }).update({
    data: { disable }
  })
}