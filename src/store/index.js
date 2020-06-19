import Vue from 'vue'
import Vuex from 'vuex'
import * as _ from 'lodash'
import { formatHeadMonth, formatMonth, getIconStyleByTypename, getCoefficientByType, formatDateAsText } from '@/utils/index'
import {
	duplicateModeMap,
  daySuboption,
  weekSuboption,
  monthSuboption,
	yearSuboption
} from '@/constant/duplicateModeMultiOption'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		months: [],
		accounts: [],
		pocketbookList: [],
		bookkeepingTypes: [],
		pendingPocketbookList: [],
		logined: false,
		userInfo: undefined,
		currentAccount: undefined,
		currentPocketbook: undefined,
		currentTimedAutoPocketbook: undefined,
		defaultAccount: undefined,
	},
	mutations: {
		setAccounts(state, accounts) {
			state.accounts = accounts
		},
		addAccountToList(state, account) {
			state.accounts.push(account)
		},
		deleteAccountById(state, accountId) {
			const list = state.accounts
			state.accounts = list.filter((item) => {
				return !_.isEqual(item._id, accountId)
			})
		},
		updateAccountById(state, accountId, balance) {
			const index = _.findIndex(state.accounts, ['account_id', accountId])
			state.accounts[index].balance = balance
		},
		setCurrentAccount(state, account) {
			state.currentAccount = account
		},
		setPocketbookList(state, list) {
			state.pocketbookList = list
		},
		addPocketbookToList(state, pocketbook) {
			const { type_name, account_id, amount, type } = pocketbook
			const iconStyle = getIconStyleByTypename(state.bookkeepingTypes, type_name)
			const accountIndex = _.findIndex(state.accounts, ['_id', account_id])

			state.accounts[accountIndex].balance += amount * getCoefficientByType(type)
			state.pocketbookList.push({ ...pocketbook, ...iconStyle })
		},
		updatePocketbookById(state, pocketbook) {
			const { _id, type_name, account_id, amount, type } = pocketbook
			const iconStyle = getIconStyleByTypename(state.bookkeepingTypes, type_name)
			const index = _.findIndex(state.pocketbookList, ['_id', _id])
			const oldPocketbook = state.pocketbookList[index]
			const oldAccountIndex = _.findIndex(state.accounts, ['_id', oldPocketbook.account_id])
			const accountIndex = _.findIndex(state.accounts, ['_id', account_id])

			if (_.isEqual(account_id, oldPocketbook.account_id)) {
				const inc = amount * getCoefficientByType(type) - oldPocketbook.amount * getCoefficientByType(oldPocketbook.type)
				state.accounts[accountIndex].balance += inc
			} else {
				state.accounts[oldAccountIndex].balance -= amount * getCoefficientByType(oldPocketbook.type)
				state.accounts[accountIndex].balance += amount * getCoefficientByType(type)
			}
			state.pocketbookList[index] = { ...pocketbook, ...iconStyle }
		},
		removePocketbookById(state, pocketbook) {
			const { _id, account_id, amount, type } = pocketbook
			const accountIndex = _.findIndex(state.accounts, ['_id', account_id])
			
			state.accounts[accountIndex].balance -= amount * getCoefficientByType(type)
			_.remove(state.pocketbookList, item => _.isEqual(_id, item._id))
		},
		setCurrentPocketbook(state, pocketbook) {
			state.currentPocketbook = pocketbook
		},
		setCurrentTimedAutoPocketbook(state, pocketbook) {
			state.currentTimedAutoPocketbook = pocketbook
		},
		setBookkeepingTypeList(state, bookkeepingTypes) {
			state.bookkeepingTypes = bookkeepingTypes
		},
		setMonths(state, months) {
			state.months = months
		},
		updateLoginStatus(state, userInfo) {
			state.logined = false

			if (!_.isNil(userInfo)) {
				state.logined = true
				state.userInfo = userInfo
			}
		},
		updateUserBookkeepingTypes(state, types) {
			state.userInfo = Object.assign(state.userInfo, { bookkeepingTypes: types })
		},
		setPendingPocketbookList(state, list) {
			state.pendingPocketbookList = list
		},
		updateTimedAutoBookkeeping(state, pocketbook) {
			const { _id, disable } = pocketbook
			const index = _.findIndex(state.pendingPocketbookList, ['_id', _id])
			state.pendingPocketbookList[index].disable = disable
		},
		updateAccountInfoById(state, account) {
			const list = [...state.accounts]
			const { _id } = account
			const index = _.findIndex(list, ['_id', _id])
			list[index] = account
			state.accounts = list
		}
	},
	getters: {
		userName(state) {
			return state.userInfo ? state.userInfo.name : ''
		},
		getMyAssets(state) {
			const accounts = state.accounts
			let totalAssets = 0
			let debtAssets = 0
			
			accounts.forEach(item => {
				totalAssets = (totalAssets * 100 + item.balance * 100) / 100
			})

			return {
				debtAssets: 0,
				totalAssets,
				netAssets: totalAssets - debtAssets,
				accounts,
			}
		},
		getAccountList(state) {
			return state.accounts
		},
		getCurrentPocketbook(state) {
			return state.currentPocketbook
		},
		getCurrentTimedAutoPocketbook(state) {
			return state.currentTimedAutoPocketbook
		},
		getPocketbookList(state) {
			return state.pocketbookList
		},
		getAccountList(state) {
			return state.accounts
		},
		getBookkeepingTypeList(state) {
			return state.bookkeepingTypes
		},
		getBookkeepingTypeByUser(state) {
			const typeIds = state.userInfo.bookkeepingTypes

			return _.filter(state.bookkeepingTypes, type => _.includes(typeIds, type._id))
		},
		getMonths(state) {
			const list = state.pocketbookList
			const months = _.map(list, item => {
				return { year: item.current_year, month: item.current_month }
			})

			state.months = _.unionWith(months, _.isEqual)
			return formatHeadMonth(_.map(state.months, date => formatMonth(date)))
		},
		getCurrentAccount(state) {
			return state.currentAccount
		},
		isLogined(state) {
			return state.logined
		},
		getUserInfo(state) {
			return state.userInfo
		},
		getPendingPocketbookList(state) {
			const list = state.pendingPocketbookList

			return _.map(list, item => {
				const { type_name, account_id } = item.pocketbook
				const iconStyle = getIconStyleByTypename(state.bookkeepingTypes, type_name)
				const account_name = _.find(state.accounts, ['_id', account_id]).name
				let _description = ''

				if (!item.isRepeat) {
					const { current_year, current_month, current_day } = item.pocketbook
					_description = formatDateAsText(new Date(current_year, current_month, current_day).getTime())
				} else {
					const key = _.find(duplicateModeMap, ['value', item.mode]).label || ''
					switch (item.mode) {
						case 'day':
							_description = key + daySuboption[item.value].label
							break
						case 'week':
							_description = key + weekSuboption[item.value].label
							break
						case 'month':
							_description = key + monthSuboption[item.value].label
							break
						case 'year':
							_description = key + yearSuboption[item.value].label
							break
						default:
							_description = '无效'
							break;
					}
				}

				return {
					...item,
					pocketbook: {
						...iconStyle,
						...item.pocketbook,
						account_name,
						_description,
					},
				}
			})
		}
	}
})

export default store
