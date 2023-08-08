import { useState } from "react"
import "./HeaderUserMenu.scss"
import UserMenu from "./UserMenu/UserMenu"

const HeaderUserMenu = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null
  const [isVisible, setIsVisible] = useState(false)
  return (
    <div
      className="header-user-menu-container"
      onClick={() => (setIsVisible(!isVisible))}
    >
      {user && (
        <div className="user-credentials">
          <span>{user.username}</span>
        </div>
      )}
      {isVisible && <UserMenu setIsVisible={setIsVisible} />}
    </div>
  )
}

export default HeaderUserMenu
