const User = require('../models/user')
const { body, validationResult, check } = require('express-validator')
const { Op } = require('sequelize')


checkFields = [
    check('email').isEmail().withMessage('enter a valid email'),
    check('phone').isLength({ min: 10, max: 10 }).withMessage('phone no. must be at least 10 chars long'),
    check('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage('password must contain 8 char including atleast 1 UC, 1LC, 1Num, 1Symbol')
]


checkDuplicacyAndValidateFields = async (req, res, next) => {
    try {
        const errors = validationResult(req)

        // Username or email check
        let user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.username },
                    { email: req.body.email }
                ]
            }
        })
        if (!errors.isEmpty() || user) {
            if (user) {
                return res.status(400).send({
                    message: "Failed! Username/email is already in use!",
                    errors: errors.array()
                })
            }
            return res.status(400).json({ errors: errors.array() })
        }

        return next()
    }
    catch (error) {
        return res.status(500).send({
            ERRormessage: error.message
        })
    }
}

const validator = {
    checkDuplicacyAndValidateFields,
    checkFields
}
module.exports = validator
