import { NavLink } from "react-router-dom"
import "./GridCard.scss"
import { TItemCard, TShopCard } from "types"

type GridCardProps = {
  data: TShopCard | TItemCard
  path: string
}

const GridCard = (props: GridCardProps) => {
  if ("itemId" in props.data) {
    return (
      <NavLink
        to={props.path}
        className="grid-card-container"
      >
        <img
          src={props.data.coverImg || "/assets/default-image.png"}
          loading="lazy"
          alt={props.data.name}
        />
        <div className="grid-card-info">
          <div className="grid-card-name">{props.data.name}</div>
          <div className="grid-card-details">
            <span>
              {props.data.price} {props.data.currency}
            </span>
          </div>
        </div>
      </NavLink>
    )
  } else {
    let tags
    if (props.data.tags) {
      tags = props.data.tags.slice(0, 5).map((tag: string) => (
        <div key={tag} className="tag">
          {tag}
        </div>
      ))
    }
    const imageUrl = props.data.shopImage || "src/assets/default-image.png"
    return (
      <NavLink
        to={props.path}
        className="grid-card-container"
      >
        <img
          src={imageUrl || "/assets/default-image.png"}
          alt={props.data.name}
        />
        <div className="grid-card-info">
          <div className="grid-card-name">{props.data.name}</div>
          {tags && <div className="grid-card-tags">{tags}</div>}
        </div>
      </NavLink>
    )
  }
}

export default GridCard
