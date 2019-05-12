const fs = require('fs')

const loadData = (fileName) => {
  try {
    const dataBuffer = fs.readFileSync(fileName)
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (e) {
    return []
  }
}

module.exports = loadData
