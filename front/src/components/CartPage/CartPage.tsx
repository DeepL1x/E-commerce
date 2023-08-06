import { useEffect, useState } from "react"
import { deleteData, getData, postData } from "utils/requests"
const API = import.meta.env.VITE_API_URL

const CartPage = () => {
  const [data, setData] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getData(API + "/users/cart")
        if (res) {
          setData(res)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [isModified])

  const handleClearCart = async (_: React.MouseEvent<HTMLButtonElement>) => {
    setIsSaving(true)
    try {
      await deleteData(API + "/users/cart/all")
      setIsModified(!isModified)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCheckout = async (_: React.MouseEvent<HTMLButtonElement>) => {
    setIsSaving(true)
    try {
      const res = await postData(API + "/payments/checkout-cart")
      if (res) {
        window.location.assign(res.url)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  const cartItems = data.map((cartItem: any) => {
    return (
      <div className="cart-item" key={cartItem.itemOrderId}>
        <img src={cartItem.item.coverImg} alt={cartItem.item.name} />
        <div className="cart-item-details">
          <h3>{cartItem.item.name}</h3>
          <p>$ {cartItem.item.price}</p>
          <p>Quantity: {cartItem.amount}</p>
        </div>
      </div>
    )
  })
  const totalPrice = data.reduce(
    (acc: number, cartItem: any) => acc + cartItem.item.price * cartItem.amount,
    0
  )
  return (
    <div className="shopping-cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-items">{data && cartItems}</div>
      <div className="cart-total">
        <h3>Total: ${data && totalPrice}</h3>
        <button onClick={handleCheckout} disabled={isSaving}>
          Checkout
        </button>
        <button onClick={handleClearCart} disabled={isSaving}>
          Clear Cart
        </button>
      </div>
    </div>
  )
}

export default CartPage
