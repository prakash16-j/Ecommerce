import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Landingpage from "../pages/Landingpage";
import Login from "../auth/Login";
import Signup from "../auth/Signup";

// Layouts & Pages
import UserLayout from "../layout/UserLayout";
import UserHomePage from "../pages/UserHomepage";
import AdminLayout from "../layout/AdminLayout.jsx"; // You will need to create this
 // You will need to create this
import ProtectedRoute from "../auth/ProtectedRoute.jsx";
import CartPage from "../pages/CartPage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage.jsx";
import UserProfile from "../components/user/UserProfile.jsx";
import EditProfile from "../components/user/EditProfile.jsx";
import AdminDashboard from "../components/admin/AdminDashboard.jsx";
import ManageProducts from "../components/admin/ManageProducts.jsx";
import ManageOrders from "../components/admin/ManageOrders.jsx";
import UserOrders from "../components/user/UserOrders.jsx";

// Import your ProtectedRoute component
 // Make sure this path is correct

const routes = createBrowserRouter([
  {
    element: <App />, // <App /> is the single parent for all routes.
                      // It should provide AuthContext (e.g., be your RootLayout).
    children: [
      // --- Public Routes ---
      { path: "/", element: <Landingpage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Signup /> },

      // --- Protected User Routes ---
      {
        path: "/user",
        element: (
          <ProtectedRoute role="user">
            <UserLayout />
          </ProtectedRoute>
        ),
        // UserLayout should contain an <Outlet />
        children: [
          { path: "", element: <UserHomePage /> },
          { path: "cart", element: <CartPage /> },
          { path: "product/:productId", element: <ProductDetailPage /> },
          
            { path: "profile", element: <UserProfile /> },
          { path: "profile/edit", element: <EditProfile /> },
          { path: "orders", element: <UserOrders /> }, 
        ]
      },
      
      // --- Protected Admin Routes ---
      {
        path: "/admin",
        element: (
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        
        children: [
          { path: "/admin", element: <AdminDashboard /> },
           { path: "manage-products", element: <ManageProducts /> },
           { path: "manage-orders", element: <ManageOrders /> },
        ]
      }
    ],
  },
]);

export default routes;
