import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div className="footout bg-[#13131a]">
        <h1>
        Do you want to step in to the future before others?
        </h1>
        <div className='footdown'>
          <div className='footin'>
            <h2> CritiQ </h2>
            <h4>3/1, Lorem ipsum dolor sit amet consectetur adiliisicing ept. <br/><br/>Laborum mollitia unde omnis reiciendis. </h4>
          </div>
            <div className='footin'>
                
                
                    <p><h2>Links</h2></p>
                    <p><a className="footlink" href="#">Overons</a></p>
                    <p><a className="footlink" href="#">Social Media</a></p>
                    <p><a className="footlink" href="#">Counters</a></p>
                

            </div>
            <div className='footin'>
            
                
                  <p><h2>Company</h2></p>
                    <p><a className="footlink" href="#">Terms & Conditions</a></p>
                    <p><a className="footlink" href="#">Privacy Policy</a></p>
                    <p><a className="footlink" href="#">Contact</a></p>
                
            </div>
            <div className='footin'>
              
                
                  <p><h2>Contact</h2></p>
                    <p><a className="footlink" href="#">07twik@gmail.com</a></p>
                    <p><a className="footlink" href="#">085-132567</a></p>
                    <p><a className="footlink" href="#">085-132567</a></p>
                
            </div>
        </div>
        <div className='footbottom'>
          <h2>©2024 <span className='picc'>CritiQ</span>. All rights reserved.</h2>
          </div>

    </div>
  )
}

export default Footer