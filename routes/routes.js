const express = require('express')
const axios = require('axios')
const base64Arraybuffer = require('base64-arraybuffer')
const R = require('ramda')
const fs = require('fs')

const router = new express.Router()

const loadData = require('../services/loadData')

router.get('/api/users/:id', async (req, res) => {
  const id = req.params.id
  const response = await axios.get(`https://reqres.in/api/users/${id}`)
  res.send(response.data)
})

router.get('/api/users/:id/avatar', async (req, res) => {
  const id = req.params.id

  const userData = loadData('userData.json')
  // This finds the index of the object from the array containing the user data based on the user id
  const userObjectIndex = R.findIndex(R.propEq('id', id))(userData)

  if(userData === [] || userObjectIndex === -1) {
    const response = await axios.get(`https://reqres.in/api/users/${id}`)
    const imageUrl = response.data.data.avatar

    const imageBinary = await axios.get(imageUrl, {responseType: 'arraybuffer'})
    const base64String = base64Arraybuffer.encode(imageBinary.data)
    const base64StringCompleteData = `data:${imageBinary.headers['content-type']};base64,${base64String}`

    //this pushes the data to userData.json file
    userData.push({
      id: req.params.id,
      data: base64StringCompleteData
    })
    fs.writeFileSync('userData.json',JSON.stringify(userData))

    res.send(base64StringCompleteData)
  } else {
    res.send(userData[userObjectIndex].data)
  }
})

router.delete('/api/users/:id/avatar', async(req, res) => {
  const id = req.params.id

  let userData = loadData('userData.json')
  // This finds the index of the object from the array containing the user data based on the user id
  const userObjectIndex = R.findIndex(R.propEq('id', req.params.id))(userData)

  if( userData === [] || userObjectIndex === -1 ) {
    res.send(`User ${id} not found the userData`)
  } else {
    const removingUserData = userData[userObjectIndex]
    // This removes one object from the array of objects based on the index
    userData = R.remove(userObjectIndex,1,userData)
    fs.writeFileSync('userData.json',JSON.stringify(userData))

    res.send(removingUserData)
  }
})

module.exports = router
