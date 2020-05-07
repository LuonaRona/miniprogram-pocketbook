import * as _ from 'lodash'
import {
  duplicateModeMap,
  daySuboption,
  weekSuboption,
  monthSuboption,
  yearSuboption,
} from '../constant/duplicateModeMultiOption';

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

const formatDateAsText = (_date) => {
  if (!_date) { return '' }
  const date = new Date(_date)

  const yyyy = date.getFullYear()
  const mm = `0${date.getMonth() + 1}`.substr(-2)
  const dd = `0${date.getDate()}`.substr(-2)

  return `${yyyy}年${mm}月${dd}日`
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

const getDuplicateModeText = ([cycleIndex, suboptionIndex]) => {
  if (_.isNil(cycleIndex) || _.isNil(suboptionIndex)) return ''
  const optionArray = [daySuboption, weekSuboption, monthSuboption, yearSuboption]
  
  return duplicateModeMap[cycleIndex].label + optionArray[cycleIndex][suboptionIndex].label
}

const getDuplicateModeValue = ([cycleIndex, suboptionIndex]) => {
  if (_.isNil(cycleIndex) || _.isNil(suboptionIndex)) return ''
  const optionArray = [daySuboption, weekSuboption, monthSuboption, yearSuboption]
  
  return [duplicateModeMap[cycleIndex].value, optionArray[cycleIndex][suboptionIndex].value]
}

const getIconStyleByTypename = (list, typename) => {
  return _.find(list, ['name', typename])
}

const getTomorrowTime = () => {
  const date = new Date()
  return new Date(date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1).getTime()
}

const getCoefficientByType = type => {
  return _.isEqual('收入', type) ? 1 : -1
}

const getTotalByType = (list, key = 'amount') => {
  return _.sumBy(list, item => {
    return item[key] * getCoefficientByType(item.type)
  })
}

const sortBy = (list, key, _desc = false) => {
  const desc = _desc ? 1 : -1
  return list.sort((a, b) => {
    return a[key] < b[key] ? desc : - desc
  })
}

const getDateString = (year, _month, _day) => {
  const month = `0${_month}`.substr(-2)
  const day = `0${_day}`.substr(-2)
  
  return `${year}/${month}/${day}`
}

export {
  precision,
  formatDate,
  formatDateAsText,
  formatWeek,
  formatMonth,
  formatHeadMonth,
  formatDay,
  getStartDate,
  getEndDate,
  getYearMonthDayArray,
  getYearMonthArray,
  getDuplicateModeText,
  getDuplicateModeValue,
  getIconStyleByTypename,
  getTomorrowTime,
  getTotalByType,
  getCoefficientByType,
  getDateString,
  sortBy,
}
