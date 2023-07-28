import AddCard from "components/Grid/AddCard/AddCard"
import Grid from "components/Grid/Grid"
import GridCard from "components/Grid/GridCard/GridCard"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { TItemCard } from "types"
import { getData } from "utils/requests"

const API = import.meta.env.VITE_API_URL

const UserShopItemsPage = () => {
  const [items, setItems] = useState<TItemCard[]>()
  const { shopId } = useParams()

  useEffect(() => {
    getData(API + `/shops/${shopId}/items`).then((response: TItemCard[]) =>
      setItems(response)
    )
  }, [shopId])

  const cards = items?.map((item) => (
    <GridCard path={`/user/${item.shopId}/${item.itemId}`} data={item} />
  ))
  return (
    <div className="items-page-container">
      <Grid title="Items">
        {cards}
        <AddCard path={`/user/${shopId}/add-item`} />
      </Grid>
    </div>
  )
}

export default UserShopItemsPage
