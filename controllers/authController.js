import User from '../models/User.js'
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'

const register = async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        throw new BadRequestError('please provide all values')
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        throw new BadRequestError('Email already exists')
    }

    const user = await User.create({ name, email, password })
    const token = user.createJWT()
    res.status(201).json({
        user: {
            name: user.name,
            email: user.email,
            location: user.location,
            lastName: user.lastName
        },
        token,
        location: user.location
    })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide all values!')
    }
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        throw new UnAuthenticatedError('Invalid Credentials')
    }

    // console.log(user)

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    user.password = undefined
    res.status(201).json({ user, token, location: user.location })
}

const updateUser = async (req, res) => {
    const { email, name, lastName, location } = req.body

    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('please provide all values!')
    }
    // console.log(req.user)
    // try {
        const user = await User.findOne({ _id: req.user.id });
        user.email = email
        user.lastName = lastName
        user.name = name
        user.location = location

        await user.save()
        const token = user.createJWT()
        res.status(201).json({ user, token, location: user.location })



    // } catch (error) {

    // }
}

export { register, login, updateUser }