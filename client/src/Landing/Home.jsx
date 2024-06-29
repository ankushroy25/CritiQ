import React from 'react'
import Sec1 from './Sec1'
import Payment from './Payment'
import Sec2 from './Sec2'
import Sec3 from './Sec3'
import Footer from './Footer'
import Navbar from './Navbar'

const Home = () => {
  return (
    <div className='homeout'>
      <Navbar />
        <Sec1 />
        <Sec2 />    
        <Sec3 />
        <Payment />
    </div>
  )
}

export default Home