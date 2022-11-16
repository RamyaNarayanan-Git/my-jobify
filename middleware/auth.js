import { UnAuthenticatedError } from "../errors/index.js"
import jwt from 'jsonwebtoken'

const auth = async (req,res,next) => {
    const authHeader = req.headers.authorization
    
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnAuthenticatedError('Authentication failed')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(payload)
        req.user = payload
        next()
    } catch(error){
        throw new UnAuthenticatedError('Authentication failed!')
    }
    // console.log(authHeader)

}

export default auth