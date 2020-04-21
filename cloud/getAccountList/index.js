const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async () => {
  const _openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  const rs = await db.collection('account').where({ _openid }).get()
  const list = _.sortBy(rs.data, 'timestamp')
  let assets = 0
  let debt = 0
  list.forEach(item => {
    assets = (assets * 100 + item.balance * 100) / 100
  })

  return {
    assets,
    debt,
    netAssets: assets - debt,
    list,
  }
}
