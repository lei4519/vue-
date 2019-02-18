import model from "model"
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
      content: '用户名或密码错误'
    })
  }
}

export default {
  fetchTodos({commit}) {
    commit('startLoading')
    return model.getAllTodos()
    .then(data => {
      commit('endLoading')
      commit('filltodos', data)
    })
    .catch(err => {
      commit('endLoading')
      handleError(err)
    })
  },
  addTodo({commit}, todo) {
    commit('startLoading')
    model.addTodo(todo)
      .then(data => {
        commit('endLoading')
        commit('addTodo', data)
        notify({
          content: '你又多了一件事要做~'
        })
      })
      .catch(err => {
        commit('endLoading')
        handleError(err)
      })
  },
  updateTodo({commit}, {id, todo}) {
    model.updateTodo(id, todo)
      .then(todo => {
        commit('updateTodo', {id, todo})
      })
      .catch(err => {
        handleError(err)
      })
  },
  deleteTodo({commit}, id) {
    commit('startLoading')
    model.deleteTodo(id)
      .then(todo => {
        commit('endLoading')
        commit('deleteTodo', id)
        notify({
          content: '你又少了一件事要做~'
        })
      })
      .catch(err => {
        commit('endLoading')
        handleError(err)
      })
  },
  deleteAllCompleted({state, commit}) {
    commit('startLoading')
    const ids = state.todos.filter(t => t.completed).map(t => t.id)
    model.deleteCompleted(ids)
      .then(() => {
        commit('endLoading')
        commit('deleteAllCompleted')
        notify({
          content: '清理一下~'
        })
      })
      .catch(err => {
        commit('endLoading')
        handleError(err)
      })
  },
  login ({commit}, {username, password}) {
    return new Promise((resolve, reject) => {
      commit('startLoading')
      model.login(username, password)
        .then(data => {
          commit('endLoading')
          commit('doLogin', data)
          notify({
            content: '登录成功'
          })
          resolve()
        })
        .catch(err => {
          commit('endLoading')
          handleError(err)
        })
    })
  }
}