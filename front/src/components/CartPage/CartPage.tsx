import { useEffect, useState } from "react"
import { deleteData, getData, postData } from "utils/requests"
import "./CartPage.scss"

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

  const handleDeleteCartItem = async (cartItemId: string) => {
    setIsSaving(true)
    try {
      await deleteData(API + "/users/cart/" + cartItemId)
      setIsModified(!isModified)
    } catch (_) {
      alert("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  const cartItems = data.map((cartItem: any) => {
    return (
      <div className="cart-item" key={cartItem.itemOrderId}>
        <div className="cart-item-data-container">
          <img src={cartItem.item.coverImg} alt={cartItem.item.name} />
          <div className="cart-item-details">
            <div className="name">{cartItem.item.name}</div>
            <div className="price">${cartItem.item.price}</div>
            <span>Quantity: {cartItem.amount}</span>
          </div>
        </div>
        <div
          className="delete-cart-item-button"
          onClick={() => handleDeleteCartItem(cartItem.itemOrderId as string)}
        >
          <img src="/assets/delete.svg" alt="delete" /> Delete item
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
      <div className="cart-items-container">
        <h1>Shopping Cart</h1>
        {data && <div className="cart-items">{cartItems}</div>}
        {!data && <h3>Your cart is empty</h3>}
      </div>
      <div className="cart-info-container">
        <div className="cart-total">
          <h3>
            Total: ${data && totalPrice}
            {!data && 0}
          </h3>
          <button onClick={handleCheckout} disabled={isSaving}>
            Checkout
          </button>
          <button onClick={handleClearCart} disabled={isSaving}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
