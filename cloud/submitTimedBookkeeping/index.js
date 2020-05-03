const _ = require('lodash')
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const getBookkeepingListByCurrentDate = (list) => {
  const groupByRepeat = _.groupBy(list, 'isRepeat')
  const noRepeatBookkeepingList = getBookkeepingListByNoRepeat(groupByRepeat['false'] || [])
  const repeatBookkeepingList = getBookkeepingListByRepeat(groupByRepeat['true'] || [])
  console.log(noRepeatBookkeepingList, repeatBookkeepingList)

  return [...noRepeatPendingList, ...repeatBookkeepingList]
}

const getBookkeepingListByNoRepeat = (list) => {
  if (!list.length) { return [] }
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()
  const submitList = []

  _.forEach(list, item => {
    const { _openid } = item
    const { current_year, current_month, current_day } = item.pocketbook
    
    if (_.isEqual(currentYear, current_year) &&
        _.isEqual(currentMonth, current_month) &&
        _.isEqual(currentDay, current_day)) {
          submitList.push(formatPocketbook(_openid, item.pocketbook))
        }
  })

  return submitList
}
const getBookkeepingListByRepeat = (list) => {
  if (!list.length) { return [] }

  const submitList = []
  const today = new Date()
  const currentDay = today.getDay()
  const currentDate = today.getDate()
  const currentMonth = today.getMonth() + 1
  const currentEndDate = new Date(today.getFullYear(), currentMonth, 0).getDate()

  _.forEach(list, item => {
    const { _openid, mode, value } = item
    const isEveryDay = _.isEqual(mode, 'day')
    const isEveryWeek = _.isEqual(mode, 'week')
    const isEveryMonth = _.isEqual(mode, 'month')
    const isEveryYear = _.isEqual(mode, 'year')
    const monthValue = value > currentEndDate ? currentEndDate : value

    const isEveryWeekCurrentDate = isEveryWeek &&
                                   _.isEqual(currentDay, value)
    const isEveryMonthCurrentDate = isEveryMonth &&
                                    _.isEqual(currentDate, monthValue)
    const isEveryYearCurrentDate = isEveryYear &&
                                   _.isEqual(currentMonth, value) &&
                                   _.isEqual(currentDate, 1)
    
    if (isEveryDay ||
        isEveryWeekCurrentDate ||
        isEveryMonthCurrentDate ||
        isEveryYearCurrentDate) {
      submitList.push(formatPocketbook(_openid, item.pocketbook))
    }
  })

  return submitList
}

const formatPocketbook = (_openid, pocketbook) => {
  const today = new Date()
  const current_year = today.getFullYear()
  const current_month = today.getMonth() + 1
  const current_day = today.getDay()
  const timestamp = new Date(current_year, current_month - 1, current_day, 0, 0, 0).getTime()

  return {
    _openid,
    ...pocketbook,
    current_year,
    current_month,
    current_day,
    timestamp,
    automatic: true,
  }
}

exports.main = async () => {
  const db = cloud.database()
  const cmd = db.command
  const currentTimer = new Date().getTime()
  const { data } = await db.collection('pending_pocketbook_list').where({
    endDate: cmd.gte(currentTimer).or(cmd.eq(0)),
    startDate: cmd.lte(currentTimer),
    disable: false,
    done: false,
  }).get()
  const pendingList = getBookkeepingListByCurrentDate(data)
  const result = await _.map(pendingList, (item) => {
    return await cloud.callFunction({
      name: 'addPocketbook',
      data: {
        type: 'add',
        _openid: item._openid,
        data: item,
      },
    })
  })

  return { pendingList, result }
}
