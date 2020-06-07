const cloud = require('wx-server-sdk')
const _ = require('lodash')
const { initialAccountData } = require('./initialAccountData')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const getUsers = async () => {
  const rs = await cloud.database().collection('users').get()

  return rs.data
}

const createUser = async (_openid, name) => {
  const bookkeepingTypes = await cloud.database().collection('bookkeeping_type').get()

  return await cloud.database().collection('users').add({
    data: {
      _openid,
      name,
      activated: false,
      createdTimer: new Date().getTime(),
      bookkeepingTypes: _.map(bookkeepingTypes.data, '_id')
    }
  })
}

const generateUserAccount = async (_openid) => {
  const accountList = await cloud.database().collection('account')
        .where({ _openid }).get().then(({ data }) => data)
  if (accountList.length) return Promise.resolve()
  const data = initialAccountData
  
  return new Promise((resolve, reject) => {
    data.forEach((item) => {
      cloud.database().collection('account').add({
        data: { ...item, _openid, timestamp: new Date().getTime() }
      }).then(() => {}, () => reject())
    })

    return resolve('已成功生成用户账户')
  })
}

const activateUser = async (id) => {
  return await cloud.database().collection('users')
        .where({ _openid: id })
        .update({ data: { activated: true }})
        .then(() => {
          return cloud.database().collection('users')
                .where({ _openid: id }).get()
                .then(({ data }) => {
                    return data[0]
                })
        })
}

exports.main = async (event, context) => {
  const id = cloud.getWXContext().OPENID
  const { name } = event
  if (!id) { return '用户ID获取失败' }
  const users = await getUsers()
  const userExists = _.includes(_.map(users, '_openid'), id)

  if (!userExists) {
    return await createUser(id, name).then(() => {
      return generateUserAccount(id).then(() => {
        return activateUser(id)
      })
    }, () => '用户创建失败')
  }

  return _.find(users, ['_openid', id])
}