import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Navbar() {

    const navigate = useNavigate();
    const { isLoggedIn, logout, userRole } = useContext(AuthContext);
    const { getCartItemCount } = useContext(CartContext);
    const cartCount = getCartItemCount();

    return (
        <ul className="nav">

            <li className="scroll-to-section">
                <Link to="/">Home</Link>
            </li>

            {isLoggedIn && userRole === 'admin' &&  (
                <li className="scroll-to-section">
                    <Link to="/addproduct">Add Product</Link>
                </li>
                
            )}
            {isLoggedIn && userRole === 'admin' && (
                <li className="scroll-to-section">
                    <Link to="/dashboard">Product List </Link>
                </li>
                
            )}


            <li className="submenu">
                <a href="#">Pages</a>

                <ul>

                    <li>
                        <Link to="/about">About Us</Link>
                    </li>

                    <li>
                        <Link to="/product">Products</Link>
                    </li>

                    <li>
                        <Link to="/contact">Contact Us</Link>
                    </li>

                </ul>
            </li>


            <li className="submenu">
                <a href="#">Features</a>
                <ul>

                    {!isLoggedIn && (
                        <li><Link to="/login">Login</Link></li>

                    )}
                    {!isLoggedIn && (
                        <li><Link to="/register">Register</Link></li>

                    )}

                    {isLoggedIn && (
                        <li><Link to="/orders">Order History</Link></li>
                    )}

                    {isLoggedIn && (
                        <li>
                            <button onClick={logout}>Logout</button>
                        </li>
                    )}
                </ul>
            </li>


            <li className="scroll-to-section">
                <Link to="/cart" style={{ position: "relative" }}>
                    <i className="fa fa-shopping-cart"></i> Cart
                    {cartCount > 0 && (
                        <span
                            style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                backgroundColor: "#ff6b6b",
                                color: "white",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            {cartCount}
                        </span>
                    )}
                </Link>
            </li>

        </ul>
    );
}

export default Navbar;