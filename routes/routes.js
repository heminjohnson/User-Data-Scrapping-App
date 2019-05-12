const express = require('express')
const axios = require('axios')

const router = new express.Router()

router.get('/api/users/:id', async (req, res) => {
  const id = req.params.id
  const response = await axios.get(`https://reqres.in/api/users/${id}`)
  res.send(response.data)
})

module.exports = router
