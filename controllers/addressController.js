const jwt = require('jsonwebtoken');
const Address = require('../models/address');
require("dotenv").config()



exports.addAddress = async (req, res) => {

    try {

        var token = req.session.token
        if (token) {

            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const userId = decode.id
            const address = req.body.address

            await Address.create({
                address: address,
                userId: userId
            })
            res.send({
                message: "address added",
                userId: userId,
                address: req.body.address
            })
        } else {
            res.status(401).json({
                msg: 'Unauthenticated Access! Please login firrst.'
            });
        }

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

exports.getAddressByUserId = async (req, res) => {
    try {
        var token = req.session.token
        if (token) {

            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const userId = decode.id

            await Address.findAll({
                where: {
                  userId: userId
                }
              })
              .then(addresses => {
                res.send({
                    message: "Addresses for "+"userId: "+userId,
                    Addresses: addresses
                })
              })

        } else {
            res.status(401).json({
                msg: 'Login to see your Addresses'
            });
        }

        
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}