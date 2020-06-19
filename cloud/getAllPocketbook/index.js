const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const $ = db.command.aggregate
const MAX_LIMIT = 100

exports.main = async (event) => {
  // 获取用户 OPENID
  const _openid = cloud.getWXContext().OPENID
  // 先取出集合记录总数
  const countResult = await db.collection('pocket_book_list').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i += 1) {
    const promise = db.collection('pocket_book_list').aggregate()
    .match({ _openid }).skip(i * MAX_LIMIT).limit(MAX_LIMIT)
    .lookup({
      from: 'bookkeeping_type',
      localField: 'type_name',
      foreignField: 'name',
      as: 'pocketbookList'
    }).replaceRoot({
      newRoot: $.mergeObjects([ $.arrayElemAt(['$pocketbookList', 0]), '$$ROOT' ])
    }).project({
      pocketbookList: 0
    }).end()
    tasks.push(promise)
  }

  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      list: acc.list.concat(cur.list),
      errMsg: acc.errMsg,
    }
  })
}