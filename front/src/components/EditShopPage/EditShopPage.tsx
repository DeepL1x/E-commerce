import Section from "components/ShopPage/Section/Section"
import { useState, useEffect, useRef } from "react"
import { useParams, NavLink, useNavigate } from "react-router-dom"
import TagsInput from "react-tagsinput"
import { TShop } from "types"
import { useImmer } from "use-immer"
import { getData, postData, putData } from "utils/requests"
import "react-tagsinput/react-tagsinput.css"
import "./EditShopPage.scss"

const API = import.meta.env.VITE_API_URL
const emptyShop = {
  name: "",
}

export const EditShopPage = () => {
  const [original, setData] = useState<TShop>(emptyShop as TShop)
  const [modified, setModified] = useImmer<TShop>({} as TShop)
  const [isSaving, setIsSaving] = useState(false)
  const [reset, setReset] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const { shopId } = useParams()
  const navigate = useNavigate()

  const sectionsData = original?.sections

  useEffect(() => {
    async function fetchData() {
      const res: TShop = await getData(API + `/shops/${shopId}/full`)
      if (res) {
        setData(res)
        setModified((draft) => {
          draft.shopId = res.shopId
        })
      }
    }
    fetchData()
  }, [shopId, reset])

  const sections = sectionsData?.map((section) => (
    <Section key={section.sectionId} {...section} />
  ))

  const handleImgInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setModified((draft) => {
          draft.shopImage = reader.result as string
          draft.image = file
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const dataToSend = new FormData()

    for (const key in modified) {
      if (modified[key as keyof TShop]) {
        if (key === "file") {
          dataToSend.append(key, modified[key as keyof TShop] as Blob)
        } else if (key !== "shopImage") {
          if (key === "tags") {
            dataToSend.append(key, JSON.stringify(modified[key as keyof TShop]))
          } else {
            dataToSend.append(key, modified[key as keyof TShop] as string)
          }
        }
      }
    }

    // for (var key of dataToSend.entries()) {
    //   console.log(key[0] + ", " + key[1])
    // }

    if (shopId) {
      putData(API + `/shops/${shopId}`, dataToSend, {
        "Content-Type": "multipart/form-data",
      })
        .then((res: TShop) => {
          if (res) {
            setReset(!reset)
            if (res.shopId != shopId) {
              navigate(`/user/${res.shopId}`)
            }
            form.current?.reset()
          }
        })
        .finally(() => {
          setModified({} as TShop)
          setIsSaving(false)
        })
    } else {
      postData(API + `/shops`, dataToSend, {
        "Content-Type": "multipart/form-data",
      })
        .then((res: TShop) => {
          if (res) {
            setReset(!reset)
            setModified({} as TShop)
            if (res.shopId != shopId) {
              navigate(`/user/${res.shopId}`)
            }
            form.current?.reset()
          }
        })
        .finally(() => {
          setIsSaving(false)
        })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModified((draft) => {
      draft[e.target.name as keyof TShop] = e.target.value as never
    })
  }

  return (
    <div className="edit-shop-page-container">
      <form ref={form} className="shop-page-header" onSubmit={handleSubmit}>
        <div className="image-container">
          <img
            src={
              modified.shopImage
                ? modified.shopImage
                : original.shopImage
                ? original.shopImage
                : "/assets/default-image.png"
            }
            loading="lazy"
            alt={"shop image"}
          />
          <input
            type="file"
            name="image"
            accept="image/jpeg, image/png"
            onChange={handleImgInput}
            disabled={isSaving}
          />
        </div>
        <div className="shop-info">
          <input
            className="title"
            name="name"
            value={modified.name !== undefined ? modified.name : original?.name}
            onChange={handleInputChange}
          />
          <TagsInput
            value={
              modified.tags ? modified.tags : original.tags ? original.tags : []
            }
            disabled={isSaving}
            onlyUnique
            addOnBlur
            onChange={(tags) =>
              setModified((draft) => {
                draft.tags = tags
              })
            }
          />
        </div>
        <input type="submit" className="submit-button" />
        <NavLink to={`/user/${shopId}/items`} className="browse-items-link">
          <img src="/assets/shopping-cart.svg" alt="shopping cart" />
          Browse items
        </NavLink>
      </form>
      {sections}
    </div>
  )
}

export default EditShopPage
