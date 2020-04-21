const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
  const db = cloud.database()
  const accountId = event.account_id
  const amount = event.amount

  return db.collection('pocket_book_list').where({
    _id: event._id,
  }).remove().then(() => cloud.callFunction({
    name: 'updateBalanceByAccount',
    data: event.type === '收入' ?
      { accountId, income: - amount } :
      { accountId, outlay: - amount }
  }))
}
