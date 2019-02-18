export default {
  filltodos(state, todos) {
    state.todos = todos
  },
  addTodo(state, todo) {
  	state.todos.unshift(todo)
  },
  updateTodo(state, {id, todo}) {
  	const i = state.todos.findIndex(t => t.id === id)
  	state.todos.splice(i , 1, todo)
  },
  deleteTodo(state, id) {
  	const i = state.todos.findIndex(t => t.id === id)
  	state.todos.splice(i , 1)
  },
  deleteAllCompleted(state) {
    state.todos = state.todos.filter(t => !t.completed)
  },
  doLogin(state, userInfo) {
    state.user = userInfo
  }
}