const _ = require('lodash')
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
  const db = cloud.database()
  const cmd = db.command
  const { accountId, income, outlay, balance } = event

  if (income && outlay) {
    return db.collection('account').where({ _id: accountId }).update({
      data: {
        inTotal: cmd.inc(income),
        outTotal: cmd.inc(outlay),
        balance: cmd.inc(income - outlay)
      },
    })
  }

  if (income) {
    return db.collection('account').where({ _id: accountId }).update({
      data: {
        inTotal: cmd.inc(income),
        balance: cmd.inc(income),
      }
    })
  }

  if (outlay) {
    return db.collection('account').where({ _id: accountId }).update({
      data: {
        outTotal: cmd.inc(outlay),
        balance: cmd.inc(- outlay),
      }
    })
  }

  if (!_.isNil(balance)) {
    return db.collection('account').where({ _id: accountId }).update({
      data: { balance }
    })
  }

  return Promise.reject('没有传入需要更新的参数')
}
