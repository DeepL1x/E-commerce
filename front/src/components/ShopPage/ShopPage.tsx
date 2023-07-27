import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { getData } from "utils/requests"
import "./ShopPage.scss"
import { TShop } from "types"
import Section from "./Section/Section"

const API = import.meta.env.VITE_API_URL

const ShopMain = () => {
  const [data, setData] = useState<TShop>()
  const { shopId } = useParams()

  const sectionsData = data?.sections

  useEffect(() => {
    async function fetchData() {
      const res: TShop = await getData(API + `/shops/${shopId}/full`)
      if (res) {
        setData(res)
      }
    }
    fetchData()
  }, [shopId])

  const sections = sectionsData?.map((section) => (
    <Section key={section.sectionId} {...section} />
  ))
  const tags = data?.tags.map((tag) => (
    <div key={tag} className="tag">
      {tag}
    </div>
  ))

  return (
    <div className="shop-page-container">
      <div className="shop-page-header">
        <div className="shop-data">
          <img src={data?.shopImage} loading="lazy" alt={data?.name} />
          <div className="shop-info">
            <div className="title">{data?.name}</div>
            <div className="tags">{tags}</div>
          </div>
        </div>
        <NavLink to={`/shops/${shopId}/items`} className="browse-items-link">
          <img src="/assets/shopping-cart.svg" alt="shopping cart" />
          Browse items
        </NavLink>
      </div>

      {sections}
    </div>
  )
}

export default ShopMain
