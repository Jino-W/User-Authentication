const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new Schema({
    username:{
        type: String,
        required: "Please enter valid Username",
        unique: true,
        minlength: 5
    },

    email:{
        type: String,
        required: "Please enter valid Email",
        unique: true,
        validate:{
            validator: function(value){
                return validator.isEmail(value)
            },
            message: function(){
                return 'invalid email'
            }
        }
    },
    password:{
        type: String,
        required: "Please enter valid Password",
        minlength: 6,
        maxlength: 128
    },
    tokens:[
        {
            token:{
                type:String
            },
            createdAt:{
                type:Date,
                default: Date.now
            }
        }
    ]
})



//own instance method
userSchema.methods.generateToken = function(){
    const user = this
    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: Number(new Date())
    }

    const token = jwt.sign(tokenData, 'jwt@123')

    user.tokens.push({token: token})

    return user.save()
        .then(function(user){
            return Promise.resolve(token)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}


//pre-hooks  -> encrypting password
userSchema.pre('save', function(next){
    const user = this
        if(user.isNew){
            bcryptjs.genSalt(10)
                .then((salt)=>{
                    console.log(salt)      //$2a$10$tzj5nkCesz0F998APwC5.O
                    bcryptjs.hash(user.password, salt)
                        .then((encryptedPassword)=>{
                            user.password = encryptedPassword
                            next()
                        })
                })
        }else{
            next()
        }
})

//own static method *           skiny controllers, fat models      -> login email,password match checking
userSchema.statics.findByCredentials = function(email, password){
    const User = this
 
    return User.findOne({email: email})
        .then(user=>{
            if(!user){
                return Promise.reject('email not found')
            }
            // res.send('email found')
            return bcryptjs.compare(password , user.password)
                .then((result)=>{
                    if(result){
                        return Promise.resolve(user)
                    }else{
                        return Promise.reject('incorrect password')
                    }
                })
        })
        .catch((err)=>{
            return Promise.reject(err)
        })
}


//own static method  
userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData
    try{
        tokenData = jwt.verify(token, 'jwt@123')
    }catch(err){
        return Promise.reject(err)
    }
    return User.findOne({
        _id: tokenData._id,
        'tokens.token':token
    })
}

const User = mongoose.model("User", userSchema)




module.exports = {
    User
}
