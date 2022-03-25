const express = require('express')
const router = express.Router()
const addressController = require('../controllers/addressController')

router.post('/add-address', addressController.addAddress)

router.get('/get-address', addressController.getAddressByUserId)

module.exports = router