const express = require('express')
const axios = require('axios')
const base64Arraybuffer = require('base64-arraybuffer')

const router = new express.Router()

router.get('/api/users/:id', async (req, res) => {
  const id = req.params.id
  const response = await axios.get(`https://reqres.in/api/users/${id}`)
  res.send(response.data)
})

router.get('/api/users/:id/avatar', async (req, res) => {
  const id = req.params.id
  const response = await axios.get(`https://reqres.in/api/users/${id}`)

  const imageUrl = response.data.data.avatar

  const imageBinary = await axios.get(imageUrl, {responseType: 'arraybuffer'})
  const base64String = base64Arraybuffer.encode(imageBinary.data)
  const base64StringCompleteData = `data:${imageBinary.headers['content-type']};base64,${base64String}`

  res.send(base64StringCompleteData)
})

module.exports = router
