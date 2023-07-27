import { useState } from "react"
import { TItem } from "types"
import { Updater } from "use-immer"
import "./EditItemSlider.scss"

type EditItemSliderProps = TItem & {
  isSaving: boolean
  modified: TItem
  setModified: Updater<TItem>
}

const EditItemSlider = (props: EditItemSliderProps) => {
  const [imgIndex, setImgIndex] = useState(-1)
  const [maxIndex, setMaxIndex] = useState(props?.imgUrls?.length | -1)

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
            draft.imgUrls[imgIndex] = reader.result as string
            draft.gallery[imgIndex] = file as File
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
      return props.modified.coverImg
        ? props.modified.coverImg
        : props.coverImg
        ? props.coverImg
        : "/assets/default-image.png"
    }
    return props.modified.imgUrls[index]
      ? props.modified.imgUrls[index]
      : props.imgUrls[index]
      ? props.imgUrls[index]
      : "/assets/default-image.png"
  }

  const imgButtons = []
  for (let i = -1; i < maxIndex; i++) {
    imgButtons.push(
      <button
        key={i}
        className={imgIndex === i ? "active" : ""}
        onClick={() => setImgIndex(i)}
      >
        <img src={getCurrentImg(i)} alt="image button" />
      </button>
    )
  }
  imgButtons.push(
    <button
      key={maxIndex}
      className={imgIndex === maxIndex ? "active" : ""}
      onClick={() => setImgIndex(maxIndex)}
    >
      <img src="/assets/cross.svg" alt="add image button" />
    </button>
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
