const _ = require('lodash')

const precision = (num, precision = 2) => {
  if (typeof num !== 'number') {
    num = parseFloat(num) || 0
  }
  if (num >= 0) {
    return (Math.floor(num * 100) / 100).toFixed(2)
  }

  return (Math.round(num * 100) / 100).toFixed(2)
}

const formatDate = (_date) => {
  const date = _date ? new Date(_date) : new Date()

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  const isThisYear = year === new Date().getFullYear()
  const mm = `0${month}`.substr(-2)
  const dd = `0${day}`.substr(-2)

  return isThisYear ? `${mm}.${dd}` : `${year}.${mm}.${dd}`
}

const formatWeek = (weekday) => {
  const weekArray = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  if (_.isEqual(typeof weekday, 'number')) {
    return weekArray[weekday]
  }

  return weekArray[new Date(weekday).getDay()]
}

const getStartDate = () => {
  const date = new Date()

  return `${date.getFullYear() - 60}/${date.getMonth() + 1}/${date.getDay()}`
}

const getEndDate = () => {
  const date = new Date()

  return `${date.getFullYear() + 2}/${date.getMonth() + 1}/${date.getDay()}`
}

const getYearMonthDayArray = (dateStr) => {
  let dateArr = dateStr.split('.')
  if (dateArr.length < 2) {
    dateArr = getDate(dateStr).split('.')
  }
  dateArr = dateArr.length === 3 ? dateArr : [new Date().getFullYear().toString(), ...dateArr]

  return _.map(dateArr, v => parseInt(v, 10))
}

const formatMonth = ({ year, month }) => {
  if (!year || !month) return

  if (year === new Date().getFullYear()) {
    return month + '月'
  }

  if (month > 9) {
    return `${year}.${month}`
  }

  return `${year}.0${month}`
}

const getYearMonthArray = (dateStr) => {
  const dateArr = dateStr.split('.')

  if (dateArr.length > 1) {
    return _.map(dateArr, v => parseInt(v, 10))
  }

  return [new Date().getFullYear(), parseInt(dateStr, 10)]
}

const formatHeadMonth = (list) => {
  if (_.isEmpty(list)) return ['本月']

  let monthList = list
  const currentMonth = `${new Date().getMonth() + 1}月`
  const headMonthIsCurrent = _.isEqual(_.head(list), currentMonth)

  if (headMonthIsCurrent) {
    monthList = _.drop(monthList)
  }

  return ['本月', ...monthList]
}

const formatDay = (day, month, year) => {
  const currentYear = new Date().getFullYear()
  const mm = `0${month}`.substr(-2)
  const dd = `0${day}`.substr(-2)

  if (year && !_.isEqual(year,currentYear)) {
    return `${year}年${mm}月${dd}日`
  }

  if (month) {
    return `${mm}月${dd}日`
  }

  return `${dd}日`
}

export {
  precision,
  formatDate,
  formatWeek,
  formatMonth,
  formatHeadMonth,
  formatDay,
  getStartDate,
  getEndDate,
  getYearMonthDayArray,
  getYearMonthArray,
}
