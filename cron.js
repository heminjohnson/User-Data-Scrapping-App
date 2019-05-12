const express = require('express')
const axios = require('axios')
const cron = require("node-cron")
const fs = require('fs')
const loadData = require('./services/loadData')

const app = express()
const port = 3001

app.use(express.json())

// schedule tasks to be run on the server
let page = 1
cron.schedule("* * * * *", async () => {
  console.log('Running Cron Job every one minute')
  const response = await axios.get(`https://reqres.in/api/users?page=${page}`)
  console.log(response.data)

  const cronData = loadData('cronData.json')
  cronData.push(response.data)
  fs.writeFileSync('cronData.json', JSON.stringify(cronData))

  page++
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})
