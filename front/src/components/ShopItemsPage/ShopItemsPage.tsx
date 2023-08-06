import Grid from "components/Grid/Grid"
import GridCard from "components/Grid/GridCard/GridCard"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TItemCard } from "types"
import { getData } from "utils/requests"
import "./ShopItemsPage.scss"

const API = import.meta.env.VITE_API_URL

const ShopItemsPage = () => {
  const [items, setItems] = useState<TItemCard[]>()
  const { shopId } = useParams()

  useEffect(() => {
    getData(API + `/shops/${shopId}/items`).then((response: TItemCard[]) =>
      setItems(response)
    )
  }, [])

  const cards = items?.map((item) => (
    <GridCard path={`/shops/${item.shopId}/${item.itemId}`} data={item} />
  ))
  return (
    <div className="items-page-container">
      <Grid title="Items">{cards}</Grid>
    </div>
  )
}

export default ShopItemsPage