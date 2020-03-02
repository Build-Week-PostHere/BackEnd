const Users = require('./authModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// bring in the secret
const { jwtSecret } = require('../config/secrets.js')
// create the router
const router = require('express').Router()
// endpoints

// (1) - REGISTRATION ENDPOINT

router.post('/register', (req, res) => {
    const newUser = req.body
    // Convert password to hash before reaching db
    const hash = bcrypt.hashSync(newUser.password, 8)
    newUser.password = hash

    if (newUser && newUser.username && newUser.password) {
        Users.register(newUser)
            .then((newId) => {
                res.status(201).json({ message:"Registered!", newId: newId})
            })
            .catch(({name, message, stack}) => {
                res.status(500).json({ name:name, message:message, stack:stack })
            })
    } else {
        res.status(400).json({ message:"Please provide a username and password."})
    }
})

// (2) - LOGIN ENDPOINT
router.post('/login', (req, res) => {
    const { username, password } = req.body
    Users.findBy({ username })
        .first()
        .then((user) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                token = generateToken(user) // LEFT OFF
            }
        })
})

// LOCAL MIDDLEWARE FOR TOKEN GENERATION
function generateToken(user) {
    // payload
    const payload = {
        subject: user.id,
        username: user.username
    }
    // secret is imported at top of file

    // options
    const options = {
        expiresIn: '8h'
    }

    // signature
    return jwt.sign(payload, jwtSecret, options)
}

module.exports = router