import { AuthContext } from "contexts/AuthContext"
import "./HeaderSignIn.scss"
import { NavLink } from "react-router-dom"
import { useContext } from "react"

const HeaderSignIn = () => {
  const { user } = useContext(AuthContext)
  return (
    <>
      {!user.isAuthenticated && (
        <NavLink to="/auth" className="header-signin-container">
          <span>Sign in</span>
          <img src="/assets/header/login.svg" alt="Sign in" />
        </NavLink>
      )}
    </>
  )
}

export default HeaderSignIn
