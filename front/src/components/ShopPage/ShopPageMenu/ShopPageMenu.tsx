import { User } from "contexts/AuthContext"
import { useRef } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { TShop } from "types"
import { putData } from "utils/requests"

const API = import.meta.env.VITE_API_URL

type ShopPageMenuProps = {
  setEditMode: (value: boolean) => void
  editMode: boolean
  original: TShop
  modified: string
}

const ShopPageMenu = ({
  editMode,
  setEditMode,
  original,
  modified,
}: ShopPageMenuProps) => {
  const saveBtn = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const userData = localStorage.getItem("user")
  const user = userData ? (JSON.parse(userData) as User) : null
  const isOwner = original?.userId ? original?.userId === user?.userId : false

  const handleSave = () => {
    if (saveBtn.current) {
      saveBtn.current.disabled = true
    }
    if (original.name !== modified) {
      const data = { shopId: original.shopId } as TShop
      if (original.name !== modified) {
        data.name = modified
      }
      putData(API + "/shops", data)
        .then((res: TShop) => {
          setEditMode(false)
          navigate("/shops/" + res.shopId)
        })
        .finally(() => {
          if (saveBtn.current) {
            saveBtn.current.disabled = false
          }
        })
    } else {
      if (saveBtn.current) {
        saveBtn.current.disabled = false
      }
    }
  }

  return (
    <div>
      <NavLink to={"/"}>Items</NavLink>
      {isOwner && editMode && (
        <button ref={saveBtn} onClick={handleSave}>
          Save
        </button>
      )}
      {isOwner && !editMode && (
        <button onClick={() => setEditMode(true)}>Edit</button>
      )}
    </div>
  )
}

export default ShopPageMenu
