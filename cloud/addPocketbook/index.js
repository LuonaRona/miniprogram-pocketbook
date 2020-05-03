const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

function isIncome(type) {
  return _.isEqual(type, '收入')
}

exports.main = (event, context) => {
  const _openid = event._openid || cloud.getWXContext().OPENID
  const db = cloud.database()

  // 新增
  if (_.isEqual(event.type, 'add')) {
    const amount = event.data.amount
    const accountId = event.data.account_id

    return db.collection('pocket_book_list')
            .add({ data: { ...event.data, _openid } })
            .then(() => cloud.callFunction({
              name: 'updateBalanceByAccount',
              data: isIncome(event.data.type) ?
                    { accountId, income: amount } :
                    { accountId, outlay: amount }
            }))
  } else {
    // 编辑
    const { oldData, data } = event
    const accountChanged = !_.isEqual(oldData.account_id, data.account_id)
    const typeChanged = !_.isEqual(oldData.type, data.type)

    return db.collection('pocket_book_list').doc(oldData._id).set({ data: { ...data, _openid } })
      .then(() => {
        // 账户发生变更
        if (accountChanged) {
          const oldAccountId = oldData.account_id
          const oldAmount = oldData.amount
          const accountId = data.account_id
          const amount = data.amount
    
          return cloud.callFunction({
            name: 'updateBalanceByAccount',
            data: isIncome(oldData.type) ?
                  { accountId: oldAccountId, income: - oldAmount } :
                  { accountId: oldAccountId, outlay: - oldAmount }
            }).then(() => cloud.callFunction({
              name: 'updateBalanceByAccount',
              data: isIncome(data.type) ?
                    { accountId, income: amount } :
                    { accountId, outlay: amount }
            }))
        } else if (typeChanged) {
          // 类型发生变更
          const accountId = data.account_id
          const outlayToIncome = isIncome(data.type)
          const income = outlayToIncome ? data.amount : - oldData.amount
          const outlay = outlayToIncome ? - oldData.amount : data.amount
    
          return cloud.callFunction({
            name: 'updateBalanceByAccount',
            data: { accountId, income, outlay }
          })
        } else {
          // 账户和类型一致
          const accountId = data.account_id
          const amount = data.amount - oldData.amount
    
          return cloud.callFunction({
            name: 'updateBalanceByAccount',
            data: isIncome(data.type) ?
                  { accountId, income: amount } :
                  { accountId, outlay: amount }
          })
        }
      })

  }
}
