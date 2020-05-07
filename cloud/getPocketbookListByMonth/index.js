const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event) => {
  const _openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  const $ = db.command.aggregate
  const rs = await db.collection('pocket_book_list').aggregate().limit(100)
    .match({
      _openid: db.command.eq(_openid),
      current_month: db.command.eq(event.month),
      current_year: db.command.eq(event.year)
    }).lookup({
      from: 'bookkeeping_type',
      localField: 'type_name',
      foreignField: 'name',
      as: 'pocketbookList'
    }).replaceRoot({
      newRoot: $.mergeObjects([ $.arrayElemAt(['$pocketbookList', 0]), '$$ROOT' ])
    }).project({
      pocketbookList: 0
    }).end()

  return rs.list
}
