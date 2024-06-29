import React from 'react'
import './Sec2.css'
import { FaPenFancy } from "react-icons/fa";
import { FaBitcoin } from "react-icons/fa";
import { FaSearchDollar } from "react-icons/fa";
const Sec2 = () => {
  return (
    <div className='sec2'>
        <h1 className='sec2head'>What is Criti-Q?</h1><br/>
    <div className='sec2out'>
        <div className='sec2left'>
        <div className="main3">
            <div className="card3">
            <div className="card-content3">
                <div className="h33"><span className='picc'>Criti</span>Q</div>
                <div className="h13">Your go-to Review platform.</div>
                <p className="p3"><span className='picc'>Give a review and get Crypto instantly directly to your metamask account</span> 
                <br/><br/><span>🖊️🚀😊 </span></p>
            </div>
            </div>
            </div>
        </div>
        <div className='sec2right'>

        <div className="container11">
        <div data-text="Find" className="glass11 r11">
                <span className='picc'><FaSearchDollar /></span>
            </div>
            <div data-text="Review" className="glass11 l11">
                <span className='picc'><FaPenFancy /></span>
            </div>
           
            <div data-text="Earn"  className="glass11 b11">
                    <span className='picc'><FaBitcoin /></span>
            </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Sec2