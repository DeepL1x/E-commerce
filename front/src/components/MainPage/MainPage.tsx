import Grid from "components/Grid/Grid"
import "./MainPage.scss"
import { useEffect, useState } from "react"
import { TShopCard } from "types"
import { getData } from "utils/requests"
import GridCard from "components/Grid/GridCard/GridCard"
const API = import.meta.env.VITE_API_URL

const MainPage = () => {
  const [shops, setShops] = useState<TShopCard[]>([])
  useEffect(() => {
    async function fetchData() {
      setShops(await getData(API + "/shops/all"))
    }
    fetchData()
  }, [])
  const cards = shops.map((shop) => (
    <GridCard
      path={`/shops/${shop.shopId}`}
      key={shop.shopId}
      data={shop}
      {...shop}
    />
  ))
  return <Grid title="Shops">{cards}</Grid>
}

export default MainPage
