const config = require('../../app.config')
const createDB = require('../../server/db/db')

const db = createDB(config.db.appId, config.db.appKey)

export default {
  getAllTodos() {
    return db.getAllTodos()
  }
}