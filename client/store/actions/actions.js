import model from "../../model/client-model"
import notify from '../../components/notification/function'
import bus from '../../util/bus'

const handleError = err => {
  if (err.code === 401) {
    notify({
      content: '请先登录'
    })
    bus.$emit('auth')
  }
  if (err.code === 400) {
    notify({
      content: err.message
    })
  }
}

export default {
  fetchTodos({commit}) {
    model.getAllTodos()
    .then(data => {
      commit('filltodos', data)
    })
    .catch(err => {
      handleError(err)
    })
  },
  login ({commit}, {username, password}) {
    return new Promise((resolve, reject) => {
      model.login(username, password)
        .then(data => {
          commit('doLogin', data)
          notify({
            content: '登录成功'
          })
          resolve()
        })
        .catch(err => {
          handleError(err)
        })
    })
  }
}