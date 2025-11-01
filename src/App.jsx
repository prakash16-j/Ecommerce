import React from 'react'
// import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import UserHomePage from './pages/UserHomepage'
import { CartProvider } from './context/CartContext'

const App = () => {
  return (
    <div>
      {/* <Navbar/> */}
      <CartProvider>
      <Outlet/>
      </CartProvider>
      {/* <UserHomePage/> */}
    </div>
  )
}

export default App
