import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import Home from "./pages/user/HomePage";
import useAuthStore from "./store/authstore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { checkAuth } from "./api/authApi";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProducts from "./pages/AdminProducts";
import AdminProductDetails from "./pages/AdminProductDetails";
import AdminCategory from "./pages/AdminCategory";
import AdminOrders from "./pages/AdminOrders";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import MyOrders from "./pages/user/MyOrders";
import OrderDetails from "./pages/user/OrderDetails";

function App() {
  const authstore = useAuthStore()

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          authstore.logout();
          authstore.setLoading(false);
          return;
        }

        const token = await firebaseUser.getIdToken();

        const data = await checkAuth(token);

       

        authstore.setAuth(data.user, data.user.role,token);
        authstore.setLoading(false);
      } catch (error) {
        console.error("Session restoration failed:", error);

        authstore.logout();
        authstore.setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <Routes>
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/" element={<Navigate to="/select-role" replace />}/>
    <Route path="/home" 
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }/>
    <Route path="/product/:productId" 
      element={
        <ProtectedRoute>
          <ProductDetails />
        </ProtectedRoute>
      }/>
    <Route path="/cart" 
      element={
        <ProtectedRoute>
          <Cart/>
        </ProtectedRoute>
      }/>
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
        } />
    <Route path="/product/:productId" 
      element={
        <ProtectedRoute>
          <ProductDetails />
        </ProtectedRoute>
      }/>
    <Route path="/orders" 
      element={
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      }/>
    <Route path="/orders/:orderId" 
      element={
        <ProtectedRoute>
          <OrderDetails />
        </ProtectedRoute>
      }/>

      <Route path="/admin/dashboard"
      element={
        <AdminProtectedRoute>
          <AdminLayout>  
            {/* admin layout accept childern */}
            <AdminDashboard/>
          </AdminLayout>
        </AdminProtectedRoute>
      }>
      </Route>

      <Route path="/admin/products" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <AdminProducts />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      <Route path="/admin/products/:productId" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <AdminProductDetails />
          </AdminLayout>
        </AdminProtectedRoute>
      } />

      <Route path="/admin/categories" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <AdminCategory/>
          </AdminLayout>
        </AdminProtectedRoute>
      }/>
      <Route path="/admin/orders" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <AdminOrders/>
          </AdminLayout>
        </AdminProtectedRoute>
      }/>
  
    </Routes>
  );
}

export default App;