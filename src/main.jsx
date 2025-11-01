import React from 'react' // Make sure React is imported
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router-dom'
import routes from './router/Router.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

// // 1. Import your new store and the Provider
// import { store } from './store/store.js'
// import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap your entire app in the Provider */}
    {/* <Provider store={store}> */}
      <AuthProvider>
        <CartProvider>
        <RouterProvider router={routes}></RouterProvider>
        </CartProvider>
      </AuthProvider>
    {/* </Provider> */}
  </React.StrictMode>
)