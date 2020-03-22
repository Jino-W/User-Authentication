const express = require('express')
const {mongoose} = require('./config/database')
const {userRouter} = require('./app/controllers/usersController')
const app = express()
const port = 3000
app.use(express.json())


app.use('/users', userRouter)

app.listen(port,  function(){
    console.log('listening to port', port)
})