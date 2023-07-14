import { MobileContext } from "../../contexts/MobileContext"
import "./Header.scss"
import HeaderLogin from "./HeaderLogin/HeaderLogin"
import HeaderLogo from "./HeaderLogo/HeaderLogo"
import HeaderSearch from "./HeaderSearch/HeaderSearch"
import { useContext } from "react"
const Header = () => {
  const { isMobile } = useContext(MobileContext)

  return (
    <header>
      {isMobile ? (
        <div className="logo-container">
          <span>Logo</span>
        </div>
      ) : (
        <HeaderLogo />
      )}
      <HeaderSearch />
      <HeaderLogin />
    </header>
  )
}

export default Header
