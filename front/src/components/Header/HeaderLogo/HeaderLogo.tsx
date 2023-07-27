import { NavLink } from 'react-router-dom'
import './HeaderLogo.scss'

const HeaderLogo = () => {
  return (
    <NavLink to="/" className="header-logo-container">
      <img src="/assets/header/Logo.svg" alt="logo" />
    </NavLink>
  )
}

export default HeaderLogo
