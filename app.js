import express from 'express'
import dotenv from 'dotenv'
import connectDBase from './config/connectDB.js'
import cors from 'cors'
import userRoute from './routes/userRoute.js'

dotenv.config()
const app =express()
const DATABASE_URL = process.env.DATABASE_URL
const port =process.env.PORT 
app.use(cors())
//connect Database
connectDBase(DATABASE_URL)

//json data
app.use(express.json())

// load user Route
app.use('/api/user',userRoute)

app.listen(port,()=>{
    console.log(`service listening at http://localhost:${port}`)
})