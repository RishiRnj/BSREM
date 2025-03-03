import React from 'react'
import { FaFacebook, FaOm } from "react-icons/fa";
import { BsTwitterX, BsWhatsapp, BsYoutube } from "react-icons/bs";
import "./Footer.css";


const Footer = () => {
    return (
        <footer
        id='footr'
            style={{
                position: "fixed",
                bottom: "0",
                left: "0",
                right: "0",
                background: "#926e00",
                color: "#fff",
                textAlign: "center",
                padding: "2px 0",
                borderTop: "2px solid #444",
            }}
        >

            <div>

            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className='ps-3' style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <div id='bl1'>
                        <span>© 2025 BSREM | All rights reserved.</span>

                    </div>
                    <div id='bl2'>
                        <span> Created by a <strong> Hindu </strong> </span>
                    </div>

                </div>



                <div className='pe-3'>
                    <a href="#" style={{ color: "#fff", margin: "0 10px" }}>
                        <BsTwitterX />
                    </a>
                    <a href="#" style={{ color: "#fff", margin: "0 10px" }}>
                        <FaFacebook />
                    </a>
                    <a href="#" style={{ color: "#fff", margin: "0 10px" }}>
                        <BsWhatsapp />
                    </a>
                    <a href="#" style={{ color: "#fff", margin: "0 10px" }}>
                        <BsYoutube />
                    </a>
                    {/* //BSERM link */}
                    <a href="#" style={{ color: "#fff", margin: "0 10px" }}>
                        {/* <img src='/favicon.ico' alt='BSREM' style={{
                        width:"30px"}}/> */}

                        <FaOm />
                    </a>

                </div>
            </div>
        </footer>
    )
}

export default Footer