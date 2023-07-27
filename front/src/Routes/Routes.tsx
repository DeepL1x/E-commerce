import AuthPage from "components/AuthPage/AuthPage"
import EditShopItemPage from "components/EditShopItemPage/EditShopItemPage"
import EditShopPage from "components/EditShopPage/EditShopPage"
import MainPage from "components/MainPage/MainPage"
import ShopItemsPage from "components/ShopItemsPage/ShopItemsPage"
import ShopPage from "components/ShopPage/ShopPage"
import UserShopItemsPage from "components/UserShopItemsPage/UserShopItemsPage"
import UserShopsPage from "components/UserShopsPage/UserShopsPage"
import { Route, Routes } from "react-router-dom"

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/shops/:shopId" element={<ShopPage />} />
      <Route path="/shops/:shopId/items" element={<ShopItemsPage />} />
      <Route path="/user/shops" element={<UserShopsPage />} />
      <Route path="/user/add-shop" element={<EditShopPage />} />
      <Route path="/user/:shopId" element={<EditShopPage />} />
      <Route path="/user/:shopId/items" element={<UserShopItemsPage />} />
      <Route path="/user/:shopId/add-item" element={<EditShopItemPage />} />
      <Route path="/user/:shopId/:itemId" element={<EditShopItemPage />} />
    </Routes>
  )
}

export default AllRoutes
