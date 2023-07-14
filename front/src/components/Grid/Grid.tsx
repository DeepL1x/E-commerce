import { TShopCard } from "types"
import "./Grid.scss"
import ShopCard from "./ShopCard/ShopCard"

type GridProps = {
  title: string
  shops: TShopCard[]
}

const Grid = (props: GridProps) => {
  const shopCards = props.shops.map((shop) => <ShopCard key={shop.shopId}{...shop} />)
  if (props.title === "Shops") {
    return (
      <div className="grid-container">
        <span>{props.title}</span>
        <div className="grid-content">{shopCards}</div>
      </div>
    )
  }
}

export default Grid
