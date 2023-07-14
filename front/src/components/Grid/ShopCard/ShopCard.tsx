import { TShopCard } from "types"

const ShopCard = (props: TShopCard) => {
  let tags
  if (props.tags) {
    tags = props.tags
      .slice(0, 5)
      .map((tag: string) => <div className="tag">{tag}</div>)
  }
  const imageUrl = props.shopImage || "src/assets/empty-image.png"
  return (
    <div className="shop-card-container">
      <img src={imageUrl} alt={props.name} />
      <div className="shop-card-info">{tags}</div>
    </div>
  )
}

export default ShopCard
