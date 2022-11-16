import Wrapper from '../assets/wrappers/Navbar'
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa'
import {useAppContext} from '../context/appContext'
import { useState } from 'react'
import Logo from './Logo'
// const user = localStorage.getItem('user')


const Navbar = () => {
    const {toggleSidebar, logoutUser, user} = useAppContext()
    const [showLogout, setShowLogout] = useState(false)
    return (
        <Wrapper>
            <div className='nav-center'>
                <button 
                    type='button'
                    className='toggle-btn' 
                    onClick={toggleSidebar}
                >
                    <FaAlignLeft />
                </button>
                <div>
                    <Logo />
                    <h3 className='logo-txt'>dashboard</h3>
                </div>
                <div className='btn-container'>
                <button 
                    className='btn' 
                    onClick={() => setShowLogout(!showLogout)}
                >
                    <FaUserCircle />
                    {user?.name}
                    <FaCaretDown />
                    </button>
                    <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
                        <button className='dropdown-btn'
                            onClick={logoutUser}
                        >
                            logout
                        </button>

                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Navbar