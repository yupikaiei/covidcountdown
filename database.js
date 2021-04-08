var TinyDB = require('tinydb')
db = new TinyDB('./submissions.db')

db.onReady = function () {
  console.log('database is ready for operating')
}

db.addRecord = function (params) {
  return new Promise((resolve, reject) => {
    db.appendItem(params, (err, record) => {
      resolve(record)
    })
  })
}

db.updateRecord = function (id, params) {
  return new Promise((resolve, reject) => {
    db.findByIdAndRemove(id, () => {
      db.appendItem(params, (err, record) => {
        resolve(record)
      })
    })
  })
}

db.hasRecord = function (uuid) {
  return new Promise((resolve, reject) => {
    db.find({ uuid: uuid }, (err, record) => {
      if (err) {
        resolve(-1)
      }
      resolve(record[0]._id)
    })
  })
}

db.getAll = function () {
  return db._data.data
}

module.exports = db
