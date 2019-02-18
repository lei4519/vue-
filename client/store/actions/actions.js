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
      content: '用户名或密码错误'
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
  addTodo({commit}, todo) {
    model.createTodo(todo)
      .then(data => {
        commit('addTodo', data)
        notify({
          content: '你又多了一件事要做~'
        })
      })
      .catch(err => {
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
    model.deleteTodo(id)
      .then(todo => {
        commit('deleteTodo', id)
        notify({
          content: '你又少了一件事要做~'
        })
      })
      .catch(err => {
        handleError(err)
      })
  },
  deleteAllCompleted({state, commit}) {
    const ids = state.todos.filter(t => t.completed).map(t => t.id)
    model.deleteAllCompleted(ids)
      .then(() => {
        commit('deleteAllCompleted')
        notify({
          content: '清理一下~'
        })
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