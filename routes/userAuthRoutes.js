require("dotenv").config()
const express = require('express')
const validator = require('../middleware/validator')
const authController = require('../controllers/authController')

const router = express.Router()

router.post('/signup',
    validator.checkFields, 
    validator.checkDuplicacyAndValidateFields, authController.signup)

router.post('/login', authController.login)
router.get("/welcome", authController.welcome)
router.get('/logout', authController.logout)


module.exports = router
