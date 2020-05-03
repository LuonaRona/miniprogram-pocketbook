import Vue from 'vue'
import Vuex from 'vuex'
import * as _ from 'lodash'
import { formatHeadMonth, formatMonth } from '@/utils/index'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		logined: false,
		userInfo: undefined,
		myAssets: {
			newest: true,
			list: [],
		},
		currentAccount: undefined,
		pocketbookList: {
			newest: true,
			list: []
		},
		currentPocketbook: undefined,
		currentTimedAutoPocketbook: undefined,
		bookkeepingTypes: [],
		months: [],
		defaultAccount: undefined,
	},
	mutations: {
		setMyAssets(state, myAssets) {
			state.myAssets = Object.assign(myAssets, { newest: true })
		},
		shouldUpdateMyAssets(state) {
			state.myAssets.newest = false
		},
		setCurrentAccount(state, account) {
			state.currentAccount = account
		},
		setPocketbookList(state, list) {
			state.pocketbookList.newest = true
			state.pocketbookList.list = list
		},
		addPocketbook(state, pocketbook) {
			state.pocketbookList.list.push(pocketbook)
		},
		shouldUpdatePocketbook(state) {
			state.pocketbookList.newest = false
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
		}
	},
	getters: {
		getCurrentPocketbook(state) {
			return state.currentPocketbook
		},
		getCurrentTimedAutoPocketbook(state) {
			return state.currentTimedAutoPocketbook
		},
		getAccountList(state) {
			return state.myAssets.list
		},
		getBookkeepingTypeList(state) {
			return state.bookkeepingTypes
		},
		getBookkeepingTypeByUser(state) {
			const typeIds = state.userInfo.bookkeepingTypes

			return _.filter(state.bookkeepingTypes, type => _.includes(typeIds, type._id))
		},
		getMonths(state) {
			const months = _.sortBy(state.months, item => {
				return - new Date(item.year, item.month + 1, 1).getTime()
			})
			return formatHeadMonth(_.map(months, date => formatMonth(date)))
		},
		getCurrentAccount(state) {
			return state.currentAccount
		},
		isLogined(state) {
			return state.logined
		},
		getUserInfo(state) {
			return state.userInfo
		}
	},
	actions: {
		updateMonths({ commit }) {
			wx.cloud.init()
			wx.cloud.callFunction({
        name: 'getMonthOfAccounting'
      }).then(({ result }) => {
        commit('setMonths', result)
      })
		}
	}
})

export default store
