const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Address = require("../models/address")
const { use } = require('bcrypt/promises')

exports.signup = async (req, res) => {

    // Save User to Database
    try {
        const user = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: await bcrypt.hash(req.body.password, 10),
        })

        res.send({ message: "User registered successfully!" })

    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            },
            include: Address,
            order: [
                [Address, 'address', 'ASC']
            ]
        })

        if (!user) {
            return res.status(404).send({ message: "User Not found." })
        }

        // console.log(user)

        const passwordIsValid = await bcrypt.compare(
            req.body.password,
            user.password
        )

        if (passwordIsValid) {
            const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: 86400, // 24 hours
            })

            req.session.token = token
            return res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                token: token,
                addresses: user.addresses
            })

        } else {
            return res.status(401).send({
                message: "Invalid Password!",
            })
        }

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

exports.welcome = async (req, res) => {
    var token = req.session.token
    if (token) {

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        res.status(200).json({
            msg: 'Authentication Successful',
            userId: decode.id
        });
    } else {
        res.status(401).json({
            msg: 'Unauthenticated Access! Please pass the token.'
        });
    }
}

exports.logout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({
            message: "You've been signed out!"
        })
    } catch (err) {
        this.next(err)
    }
}