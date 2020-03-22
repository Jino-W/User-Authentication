const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/user-authentication', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true  })
    .then(()=>{
        console.log('connected to db')
    })
    .catch((err)=>{
        console.log(err)
    })


module.exports = {
    mongoose
}