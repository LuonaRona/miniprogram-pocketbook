const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async () => {
  const _openid = cloud.getWXContext().OPENID
  const db = cloud.database()
  const $ = db.command.aggregate

  const data = await db.collection('pocket_book_list').aggregate()
    .match({
      _openid,
    }).group({
      _id: {
        year: '$current_year',
        month: '$current_month'
      }
    }).end()

  return _.map(data.list, v => v._id).filter(v => v.year && v.month)
}
