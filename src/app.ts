import express, { Request, Response, Router } from 'express'
import router from './routers/Route'

var cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(router)


app.listen(3001, () => {
    console.log("Port: 3001");
})