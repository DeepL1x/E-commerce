import { NavLink, useNavigate } from "react-router-dom"
import "./UserMenu.scss"
import { AuthContext } from "contexts/AuthContext"
import { useContext } from "react"

type UserMenuProps = {
  setIsVisible: (isVisible: boolean) => void
}

const UserMenu = ({ setIsVisible }: UserMenuProps) => {
  const { signOut } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <div className="user-menu-container">
      <NavLink
        to="/user/shops"
        className="user-menu-item"
        onClick={() => setIsVisible(false)}
      >
        <img src="/assets/shopping-bag.svg" alt="Shops" />
        Shops
      </NavLink>
      <NavLink
        to="/user/cart"
        className="user-menu-item"
        onClick={() => setIsVisible(false)}
      >
        <img src="/assets/shopping-cart.svg" alt="Orders" />
        Cart
      </NavLink>
      <div
        className="user-menu-item"
        onClick={() => {
          setIsVisible(false)
          signOut()
          navigate("/")
        }}
      >
        <img src="/assets/header/logout.svg" alt="Sign out" />
        Sign out
      </div>
      <div className="user-menu-item">
        <img
          src="/assets/chevron-right.svg"
          alt="Close"
          onClick={() => setIsVisible(false)}
        />
      </div>
    </div>
  )
}

export default UserMenu
