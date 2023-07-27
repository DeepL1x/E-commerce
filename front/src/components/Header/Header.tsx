import { MobileContext } from "../../contexts/MobileContext"
import "./Header.scss"
import HeaderLogo from "./HeaderLogo/HeaderLogo"
import HeaderSearch from "./HeaderSearch/HeaderSearch"
import { useContext } from "react"
import HeaderAuth from "./HeaderAuth/HeaderAuth"

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
      <HeaderAuth />
    </header>
  )
}

export default Header
