import { useNavigate, useParams } from "react-router-dom"
import "./EditShopItemPage.scss"
import EditItemSlider from "./EditItemSlider/EditItemSlider"
import { TItem } from "types"
import { useState, useEffect, useRef } from "react"
import { useImmer } from "use-immer"
import { getData, postData, putData } from "utils/requests"

const API = import.meta.env.VITE_API_URL
const emptyItem = {
  name: "",
  price: 0,
  currency: "",
}

const EditShopItemPage = () => {
  const { shopId, itemId } = useParams()
  const [data, setData] = useState(emptyItem as TItem)
  const [modified, setModified] = useImmer<TItem>({} as TItem)
  const [isSaving, setIsSaving] = useState(false)
  const [reset, setReset] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (itemId) {
      getData(API + `/items/${itemId}`).then((res: TItem) => {
        if (res) {
          setData(res)
        }
      })
    } else {
      setModified((draft: TItem) => {
        draft.shopId = shopId!
      })
    }
  }, [reset, shopId, itemId])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const dataToSend = new FormData()
    for (const key in modified) {
      if (modified[key as keyof TItem]) {
        if (
          key !== "coverImg" &&
          key !== "imgUrls" &&
          key !== "gallery" &&
          key !== "cover"
        ) {
          if (key === "indexes") {
            dataToSend.append(key, JSON.stringify(modified[key as keyof TItem]))
          } else {
            dataToSend.append(key, modified[key as keyof TItem] as string)
          }
        }
      }
    }
    if (modified.cover) {
      dataToSend.append("cover", modified.cover)
    }
    if (modified.gallery) {
      for (const img of modified.gallery) {
        if (img) {
          dataToSend.append("gallery", img as Blob)
        }
      }
    }
    // for (var key of dataToSend.entries()) {
    //   console.log(key[0] + ", " + key[1])
    // }

    if (itemId) {
      putData(API + `/items/${itemId}`, dataToSend, {
        "Content-Type": "multipart/form-data",
      })
        .then((res: TItem) => {
          if (res) {
            setReset(!reset)
            form.current?.reset()
            setModified({} as TItem)
          }
        })
        .catch(() => {
          alert("Something went wrong")
        })
        .finally(() => {
          setIsSaving(false)
        })
    } else {
      postData(API + `/items/${shopId}`, dataToSend, {
        "Content-Type": "multipart/form-data",
      })
        .then((res: TItem) => {
          if (res) {
            setReset(!reset)
            setModified({} as TItem)
            form.current?.reset()
            navigate(`/user/${res.shopId}/${res.itemId}`)
          }
        })
        .catch(() => {
          alert("Something went wrong")
        })
        .finally(() => {
          setIsSaving(false)
        })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModified((draft) => {
      draft[e.target.name as keyof TItem] = e.target.value as never
    })
  }

  return (
    <form
      className="edit-shop-item-container"
      onSubmit={handleSubmit}
      ref={form}
    >
      <div className="top-section">
        <EditItemSlider
          data={data}
          isSaving={isSaving}
          setModified={setModified}
          modified={modified}
        />
        <div className="info-container">
          <input
            type="text"
            name="name"
            placeholder="Item name"
            className="item-name"
            disabled={isSaving}
            value={modified.name !== undefined ? modified.name : data.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Item price"
            className="item-field"
            disabled={isSaving}
            value={modified.price !== undefined ? modified.price : data.price}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="currency"
            placeholder="Item currency"
            className="item-field"
            disabled={isSaving}
            value={
              modified.currency !== undefined
                ? modified.currency
                : data.currency
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      <input type="submit" />
    </form>
  )
}

export default EditShopItemPage
