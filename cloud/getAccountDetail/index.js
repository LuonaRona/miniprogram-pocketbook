const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const db = cloud.database()
  const rs = await db.collection('account').aggregate()
    .match({
      _id: db.command.eq(event.id),
    }).lookup({
      from: 'pocket_book_list',
      localField: '_id',
      foreignField: 'account_id',
      as: 'pocketbookList'
    }).end()

  return rs.list[0]
}
