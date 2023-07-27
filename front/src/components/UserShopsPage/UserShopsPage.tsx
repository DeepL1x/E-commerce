import AddCard from "components/Grid/AddCard/AddCard"
import Grid from "components/Grid/Grid"
import GridCard from "components/Grid/GridCard/GridCard"
import { useEffect, useState } from "react"
import { TShopCard } from "types"
import { getData } from "utils/requests"

const API = import.meta.env.VITE_API_URL

const UserShopsPage = () => {
  const [shops, setShops] = useState<TShopCard[]>([])
  useEffect(() => {
    async function fetchData() {
      setShops(await getData(API + "/users/shops"))
    }
    fetchData()
  }, [])
  const cards = shops.map((shop) => (
    <GridCard
      path={`/user/${shop.shopId}`}
      key={shop.shopId}
      data={shop}
      {...shop}
    />
  ))
  return (
    <Grid title="Your shops">
      {cards}
      <AddCard path={`/user/add-shop`} />
    </Grid>
  )
}

export default UserShopsPage
