import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import './assets/css/bootstrap.min.css'
import './assets/css/font-awesome.css'
import './assets/css/templatemo-hexashop.css'
import './assets/css/owl-carousel.css'
import './assets/css/lightbox.css'
import './assets/css/custom.css'

import Home from './Pages/Home'
import AboutUs from './Pages/AboutUs'
import Layout from "./Layout";
import ContactUs from './Pages/ContactUs';
import Product from './Pages/Product';
import SingleProduct from './Pages/SingleProduct';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import OrderHistory from './Pages/OrderHistory';
import Register from "./components/Register";
import Login from './components/Login';

import AddProduct from './components/AddProduct';
import Dashboard from './components/Dashboard';

function App() {
  const [count, setCount] = useState(0)
  let cotent = 1
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path='/contact' element={<ContactUs />} />
                <Route path='/product' element={<Product />} />
                <Route path='/singleproduct' element={<SingleProduct />} />
                <Route path='/singleproduct/:id' element={<SingleProduct />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/addproduct' element={<AddProduct/>}/>
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/editproduct/:id' element={<AddProduct/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/checkout' element={<Checkout/>}/>
                <Route path='/orders' element={<OrderHistory/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  )
}
export default App
