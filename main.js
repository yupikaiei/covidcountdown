const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./database')

const app = express()

app.use(cors())
app.use('/', express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/stats', async (req, res) => {
  allData = db.getAll()
  console.log(allData)
  if (allData.length !== 0) {
    timestampAvg =
      allData
        .map((item) => item.timestamp)
        .reduce((total, num) => total + num) / allData.length
    return res.send({
      timestampAvg: Math.floor(timestampAvg),
      submissionCount: allData.length,
    })
  }

  return res.send({})
})

app.post('/submit', async (req, res) => {
  const params = req.body
  let record

  recordId = await db.hasRecord(params.uuid)
  if (recordId !== -1) {
    record = await db.updateRecord(recordId, params)
  } else {
    record = await db.addRecord(params)
  }

  res.send(record)
})

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
