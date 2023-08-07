import { useEffect, useState } from "react"
import { TItem } from "types"
import { Updater } from "use-immer"
import "./EditItemSlider.scss"

type EditItemSliderProps = {
  data: TItem
  isSaving: boolean
  modified: TItem
  setModified: Updater<TItem>
}

const EditItemSlider = (props: EditItemSliderProps) => {
  const [imgIndex, setImgIndex] = useState(-1)
  const [maxIndex, setMaxIndex] = useState(
    props.data?.imgUrls ? props.data.imgUrls.length : 0
  )

  useEffect(() => {
    if (props.data?.imgUrls) {
      setMaxIndex(props.data.imgUrls.length)
    }
  }, [props.data])

  const handleImgInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        props.setModified((draft) => {
          if (e.target.name === "cover") {
            draft.coverImg = reader.result as string
            draft.cover = file
          } else {
            if (draft.gallery === undefined) {
              draft.gallery = []
            }
            if (draft.imgUrls === undefined) {
              draft.imgUrls = []
            }
            if (draft.indexes === undefined) {
              draft.indexes = []
            }
            draft.imgUrls[imgIndex] = reader.result as string

            if (draft.indexes.indexOf(imgIndex) !== -1) {
              draft.gallery[draft.indexes.indexOf(imgIndex)] = file as Blob
            } else {
              draft.indexes.push(imgIndex)
              draft.gallery.push(file as Blob)
            }
            if (imgIndex === maxIndex) {
              setMaxIndex(maxIndex + 1)
            }
          }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const getCurrentImg = (index: number = imgIndex): string => {
    if (index === -1) {
      if (props?.modified?.coverImg) {
        return props.modified.coverImg
      } else if (props.data?.coverImg) {
        return props.data.coverImg
      }
      return "/assets/default-image.png"
    } else if (props?.modified?.imgUrls && props.modified.imgUrls[index]) {
      return props.modified.imgUrls[index]
    } else if (props.data?.imgUrls && props.data.imgUrls[index]) {
      return props.data.imgUrls[index]
    }
    return "/assets/default-image.png"
  }

  const imgButtons = []
  for (let i = -1; i < maxIndex; i++) {
    imgButtons.push(
      <div
        key={i}
        className={imgIndex === i ? "img-button active " : "img-button"}
        onClick={() => setImgIndex(i)}
      >
        <img src={getCurrentImg(i)} alt="image button" />
      </div>
    )
  }

  imgButtons.push(
    <div
      key={maxIndex}
      className={"img-button"}
      onClick={() => {
        setImgIndex(maxIndex)
        setMaxIndex(maxIndex + 1)
      }}
    >
      <img src="/assets/cross.svg" alt="add image button" />
    </div>
  )

  return (
    <div className="edit-item-slider-container">
      <div className="img-carousel">
        <img src={getCurrentImg()} alt="item image" />
        <input
          type="file"
          disabled={props.isSaving}
          name={imgIndex === -1 ? "cover" : "gallery"}
          onChange={handleImgInput}
        />
      </div>
      <div className="img-buttons">{imgButtons}</div>
    </div>
  )
}

export default EditItemSlider
