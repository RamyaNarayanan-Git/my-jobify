import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan';
import connectDB from './db/connect.js'
import authRouter from './routes/authRouter.js'
import jobRouter from './routes/jobRouter.js'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'
import helmet from 'helmet' 
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

const app = express()

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.resolve(__dirname,'./client/build')))

if(process.env.NODE_ENV != 'production'){
    app.use(morgan('dev'))
}
app.use(express.json())
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.get('/',(req,res) => {
    res.send('welcome')
})

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobRouter)

app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'./client/build','index.html'))
})
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5001



const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log('server is listening on port:',port)
        })

    } catch(error){
        console.log(error)
    }
}

start()