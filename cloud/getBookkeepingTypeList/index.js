const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async () => {
  const db = cloud.database()
  const rs = await db.collection('bookkeeping_type').get()
  const list = _.sortBy(rs.data, 'sort');

  return list
}
