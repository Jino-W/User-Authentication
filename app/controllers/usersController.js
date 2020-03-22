const express = require('express')
const router = express.Router()
const {User} = require('../models/user')
const {authenticateUser} = require('../middlewares/authentication')
// const bcryptjs = require('bcryptjs')

//localhost:3000/users/register
router.post('/register', (req,res)=>{
    const body = req.body
    console.log(body)
    const user = new User(body)
    console.log(user.isNew)    //true
    user.save()
        .then(user=>{
            console.log(user.isNew)  //false
            res.send(user)
        })
        .catch(err=>{
            res.send(err)
        })
})

//localhost:3000/users/login
router.post('/login', (req,res)=>{
    const body = req.body
    //to find the email is already is present or not
    User.findByCredentials(body.email, body.password)
        .then((user)=>{
            // res.send(user)
            return user.generateToken()
        })
        .then(function(token){
            // res.send(token)
            res.setHeader('x-auth', token).send({})
        })
        .catch((err)=>{
            res.send(err)
        })
})


//localhost:3000/users/account
router.get('/account', authenticateUser, function(req,res){
    // res.send('success')
    const {user} = req
    res.send(user)
})

//localhost:3000/users/logout
router.delete('/logout', authenticateUser, function(req,res){
    const {user, token} = req
    User.findByIdAndUpdate(user._id, {$pull : {tokens: {token: token}}})
        .then(function(){
            res.send({notice:'Successfully loggedout'})
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    userRouter : router
}
