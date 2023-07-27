import { NavLink } from "react-router-dom"
import "./AddCard.scss"

type AddCardProps = {
  path: string
}

const AddCard = ({ path }: AddCardProps) => {
  return (
    <NavLink to={path} className="add-card-container">
      <img src="/assets/cross.svg" alt="Add" />
    </NavLink>
  )
}

export default AddCard
