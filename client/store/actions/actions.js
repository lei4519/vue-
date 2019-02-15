import model from "../../model/client-model"
import notify from '../../components/notification/function'

const handleError = err => {
  if (err.code === 401) {
    notify({
      content: '请先登录'
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
  }
}