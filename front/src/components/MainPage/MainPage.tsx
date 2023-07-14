import Grid from "components/Grid/Grid"
import "./MainPage.scss"
import { useEffect, useState } from "react"
import { TShopCard } from "types"
import { getData } from "utils/requests"
const API = import.meta.env.VITE_API_URL

const MainPage = () => {
  const [shops, setShops] = useState<TShopCard[]>([])
  useEffect(() => {
    async function fetchData() {
      setShops(await getData(API + "/shops/all"))
    }
    fetchData()
  }, [])
  console.log(shops);
  
  return <Grid title="Shops" shops={shops} />
}

export default MainPage
