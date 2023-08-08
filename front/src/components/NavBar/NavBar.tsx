import { NavLink, useLocation, useNavigate } from "react-router-dom"
import "./NavBar.scss"
import { AuthContext } from "contexts/AuthContext"
import { useContext } from "react"
const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(AuthContext)
  const getParentPath = () => {
    const pathArr = location.pathname.split("/")
    const path = pathArr.slice(1, pathArr.length - 1)

    if (path.length === 1) {
      return "/"
    }
    return path.slice(0, path.length).join("/")
  }

  return (
    <nav className="navbar-container">
      <div className="back-btn" onClick={() => navigate(getParentPath())}>
        {location.pathname !== "/" && (
          <img src="/assets/arrow-back.svg" alt="back" />
        )}
      </div>
      <div className="page-btns-container">
        <NavLink to="/" className="page-btn">
          Main page
        </NavLink>
        {user.isAuthenticated && (
          <>
            <NavLink to="/user/shops" className="page-btn">
              All your shops
            </NavLink>
            <NavLink to="/user/cart" className="page-btn">
              Your cart
            </NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar
