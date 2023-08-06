import AuthPage from "components/AuthPage/AuthPage"
import EditShopItemPage from "components/EditShopItemPage/EditShopItemPage"
import EditShopPage from "components/EditShopPage/EditShopPage"
import MainPage from "components/MainPage/MainPage"
import ShopItemsPage from "components/ShopItemsPage/ShopItemsPage"
import ShopPage from "components/ShopPage/ShopPage"
import UserShopItemsPage from "components/UserShopItemsPage/UserShopItemsPage"
import UserShopsPage from "components/UserShopsPage/UserShopsPage"
import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute"
import PaymentForm from "components/PaymentForm/PaymentForm"
import CheckoutSuccessPage from "components/CheckoutSuccessPage/CheckoutSuccessPage"
import ShopItemPage from "components/ShopItemPage/ShopItemPage"
import CartPage from "components/CartPage/CartPage"

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="/shops/:shopId" element={<ShopPage />} />
      <Route path="/shops/:shopId/items" element={<ShopItemsPage />} />
      <Route path="/shops/:shopId/:itemId" element={<ShopItemPage />} />
      <Route path="/user/shops" element={<UserShopsPage />} />
      <Route path="/user/cart" element={<CartPage />} />
      <Route path="/user/add-shop" element={<EditShopPage />} />
      <Route path="/payment" element={<PaymentForm />} />
      <Route
        path="/user/:shopId"
        element={
          <ProtectedRoute>
            <EditShopPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:shopId/items"
        element={
          <ProtectedRoute>
            <UserShopItemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:shopId/add-item"
        element={
          <ProtectedRoute>
            <EditShopItemPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:shopId/:itemId"
        element={
          <ProtectedRoute>
            <EditShopItemPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AllRoutes
