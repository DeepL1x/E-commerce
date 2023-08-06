import { useEffect, useState } from "react"
import { TItem } from "types"
import "./ItemSlider.scss"

type EditItemSliderProps = {
  data: TItem
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

  const getCurrentImg = (index: number = imgIndex): string => {
    if (index === -1) {
      if (props.data?.coverImg) {
        return props.data.coverImg
      }
      return "/assets/default-image.png"
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

  return (
    <div className="edit-item-slider-container">
      <div className="img-carousel">
        <img src={getCurrentImg()} alt="item image" />
      </div>
      <div className="img-buttons">{imgButtons}</div>
    </div>
  )
}

export default EditItemSlider
