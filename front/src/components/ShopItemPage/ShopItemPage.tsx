import { useNavigate, useParams } from "react-router-dom"
import "./ShopItemPage.scss"
import ItemSlider from "./ItemSlider/ItemSlider"
import { TItem } from "types"
import { useState, useEffect } from "react"
import { getData, postData } from "utils/requests"

const API = import.meta.env.VITE_API_URL
const emptyItem = {
  name: "",
  price: 0,
  currency: "",
}

const ShopItemPage = () => {
  const { shopId, itemId } = useParams()
  const [data, setData] = useState(emptyItem as TItem)
  const [isSaving, setIsSaving] = useState(false)
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    getData(API + `/items/${itemId}`).then((res: TItem) => {
      if (res) {
        setData(res)
      }
    })
  }, [shopId, itemId])

  const handleCheckout = async (_: React.MouseEvent<HTMLButtonElement>) => {
    setIsSaving(true)
    const checkoutData = [
      {
        itemId: data.itemId,
        amount: 1,
      },
    ]
    try {
      const res = await postData(
        API + "/payments/create-checkout-session",
        checkoutData
      )
      if (res) {
        window.location.assign(res.url)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddToCart = async (_: React.MouseEvent<HTMLButtonElement>) => {
    setIsSaving(true)
    const itemData = {
      itemId: data.itemId,
      amount: amount,
    }
    try {
      await postData(API + "/users/cart", itemData)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="shop-item-container">
      <div className="top-section">
        <ItemSlider data={data} />
        <div className="info-container">
          <div className="item-name">{data.name}</div>
          <div className="item-field">
            {data.price} <b>{data.currency.toUpperCase()}</b>
          </div>
          <div className="interaction-container">
            <div className="top-container">
              <div className="amount-container">
                <button
                  onClick={() => setAmount(amount - 1)}
                  disabled={amount <= 0}
                >
                  -
                </button>
                <div className="amount">{amount}</div>
                <button onClick={() => setAmount(amount + 1)}>+</button>
              </div>
              <button
                className="add-to-cart"
                onClick={handleAddToCart}
                disabled={isSaving || amount <= 0}
              >
                Add to cart <img src="/assets/shopping-cart.svg" alt="cart" />
              </button>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isSaving || amount <= 0}
              className="chekout"
            >
              Check out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopItemPage
