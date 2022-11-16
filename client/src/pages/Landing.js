import React from 'react'
import main from '../assets/images/main.svg'
import styled from 'styled-components'
import Wrapper from '../assets/wrappers/LandingPage'
import {Logo} from '../components'
import {Link} from 'react-router-dom'

const Landing = () => {
  return (
      <Wrapper>
          <nav>
              <Logo/>
          </nav>
          <div className='containerpage'>
              <div className='info'>
            <h1>
                Job <span>Tracking</span> App
            </h1>
            <p>

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


            </p>
            <Link to='/register' className='btn btn-hero'>Login/Register</Link>
            </div>
            <img src={main} alt='main img' className='img main-img' />
          </div>
      </Wrapper>
  )
}



export default Landing
