import React from "react";
import Navbar from "./Navbar";
function Header() {
    return <>
        <header className="header-area header-sticky">
            <div className="container">
                <div className="row">
                    <div className="col-12">

                        <nav className="main-nav">

                            <a href="/" className="logo">
                                <img src="src/assets/images/logo.png"></img>
                            </a>

                            <Navbar/>


                            <a className='menu-trigger'>
                                <span>Menu</span>
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    </>
}
export default Header;