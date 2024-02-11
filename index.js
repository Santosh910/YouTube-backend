import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import  mongoose  from 'mongoose'
import router from './Routes/index.js'

const app = express()
dotenv.config()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.use('/api/v1',router)

mongoose.connect(process.env.MONGOURL).then(()=>console.log("Database connected"))

app.listen(8002,()=>console.log("app is running on port 8002"))