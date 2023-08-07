import { AuthContext } from "contexts/AuthContext"
import { useContext } from "react"
import HeaderSignIn from "./HeaderSignIn/HeaderSignIn"
import HeaderUserMenu from "./HeaderUserMenu/HeaderUserMenu"
import "./HeaderAuth.scss"

const HeaderAuth = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="header-auth-container">
      {user.isAuthenticated && <HeaderUserMenu />}
      <HeaderSignIn />
    </div>
  )
}

export default HeaderAuth
