import Vue from 'vue'
import Vuex from 'vuex'
import * as _ from 'lodash'
import { formatHeadMonth, formatMonth } from '@/utils/index'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		openid: '',
		logined: false,
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
		bookkeepingTypes: {},
		months: [],
		defaultAccount: undefined,
	},
	mutations: {
		setOpenid(state, id) {
			state.openid = id
		},
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
		setBookkeepingTypeByUser(state, bookkeepingTypes) {
			state.bookkeepingTypes = bookkeepingTypes
		},
		setMonths(state, months) {
			state.months = months
		},
		updateLoginStatus(state, status) {
			state.logined = status
		},
	},
	getters: {
		getOpenid(state) {
			return state.openid
		},
		getCurrentPocketbook(state) {
			return state.currentPocketbook
		},
		getAccountList(state) {
			return state.myAssets.list
		},
		getBookkeepingTypeByUser(state) {
			return state.bookkeepingTypes
		},
		getMonths(state) {
			const months = _.sortBy(state.months, item => {
				return - new Date(item.year, item.month + 1, 1).getTime()
			})
			return formatHeadMonth(_.map(months, date => formatMonth(date)))
		},
		getIconByName(state, name) {
			return _.find(state.bookkeepingTypes, { name })
		},
		isLogined(state) {
			return state.logined
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
