import Wrapper from '../assets/wrappers/RegisterPage'
import { FormRow, Logo, Alert } from '../components'
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/appContext'

const initialState = { name: '', email: '', password: '', isMember: true, showAlert:false }

const Register = () => {
    const [values, setValues] = useState(initialState)
    const navigate = useNavigate()
    const {user, isLoading, showAlert, displayAlert, registerUser, loginUser} = useAppContext()

    const toggleMember = () => {
        setValues({...values, isMember: !values.isMember})
    }

    const handleChange = (e) => {
        // e.preventDefault()
        setValues({...values,[e.target.name]:e.target.value})
        // console.log(e.target)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const {name,email,password, isMember} = values
        if(!email || !password || (!isMember && !name)){
            displayAlert()
            return
        }
        const currentUser = {name, email, password}
        if(isMember){
            loginUser(currentUser)
        } else {
            registerUser(currentUser)
        }
        // console.log(values)
        // console.log(e.target)
    }

    useEffect(() => {
        if(user){
            setTimeout(() => {
                navigate('/')
            }, 3000)
        }
    }, [user,navigate])

    return (
        <Wrapper className='full-page'>
            <form className='form' onSubmit={onSubmit}>
                <Logo />
                <h3>{values.isMember ? 'Login' : 'Register'}</h3>
                {showAlert && <Alert/>}
                {
                    !values.isMember && (
                        <FormRow type="text"
                        name="name"
                        value={values.name}
                        handleChange={handleChange}
                        />
                    )
                }
                
                <FormRow type="email"
                    name="email"
                    value={values.email}
                    handleChange={handleChange}
                />

                <FormRow type="password"
                    name="password"
                    value={values.password}
                    handleChange={handleChange}
                />
                <button
                    type='submit'
                    className='btn btn-block'
                    onSubmit={onSubmit}
                    disabled={isLoading}>
                    Submit
                </button>
                <p>
                    {values.isMember ? 'Not a member yet':'Already a member ?'}
                    <button type='button' onClick={toggleMember}
                    className='member-btn'>
                    {values.isMember ? 'Register': 'Login'}
                    </button>
                </p>
            </form>
        </Wrapper>
    )
}

export default Register