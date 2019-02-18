import Axios from "axios"
import { createError } from "./util"

const request = Axios.create({
  baseURL: '/'
})

const handleRequest = request => {
  return new Promise((resolve, reject) => {
    request.then(resp => {
      const data = resp.data
      if (!data) {
        return reject(createError(400, 'no data'))
      }
      if (data.status === 400) {
        return reject(createError(400, data.message))
      }
      if (data.status === 401) {
        return reject(createError(401, data.message))
      }
      resolve(data.data)
    })
    .catch(err => {
      const resp = err.response
      reject(createError(resp.status, resp.message))
    })
  })
}

export default {
  getAllTodos() {
    return handleRequest(request.get('/api/todos'))
  },
  addTodo(todo) {
    return handleRequest(request.post('/api/todo', todo))
  },
  updateTodo(id, todo) {
    return handleRequest(request.put(`/api/todo/${id}`, todo))
  },
  deleteTodo(id) {
    return handleRequest(request.delete(`/api/todo/${id}`))
  },
  deleteCompleted(ids) {
    return handleRequest(request.post('/api/delete/completed', {ids}))
  },
  login(username, password) {
    return handleRequest(request.post('/user/login', {username, password}))
  }
}