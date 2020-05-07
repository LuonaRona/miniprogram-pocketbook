const _ = require('lodash')
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {
  const db = cloud.database()
  const cmd = db.command
  const { accountId, income = 0, outlay = 0, balance } = event

  if (_.isNil(balance)) {
    return db.collection('account').where({ _id: accountId }).update({
      data: {
        inTotal: cmd.inc(income),
        outTotal: cmd.inc(outlay),
        balance: cmd.inc(income - outlay)
      },
    })
  }

  if (!_.isNil(balance)) {
    return db.collection('account').where({ _id: accountId }).update({
      data: { balance }
    })
  }

  return Promise.reject('没有传入需要更新的参数')
}
