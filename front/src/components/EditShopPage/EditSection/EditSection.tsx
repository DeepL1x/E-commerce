import { TSection } from "types"
import "./EditSection.scss"
import { useEffect, useRef, useState } from "react"
import { useImmer } from "use-immer"
import { deleteData, postData, putData } from "utils/requests"
import { useParams } from "react-router-dom"

const API = import.meta.env.VITE_API_URL

type EditSectionProps = TSection & {
  reset: boolean
  setReset: React.Dispatch<React.SetStateAction<boolean>>
  setNewSection: React.Dispatch<React.SetStateAction<boolean>>
}

const EditSection = (props: EditSectionProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const maxIndex = 5
  const [curMaxIndex, setCurMaxIndex] = useState(props?.imgUrls?.length | 0)
  const [newImages, setNewImages] = useImmer<string[]>([])
  const [indexes, setIndexes] = useImmer<number[]>([])
  const [deletedIndexes, setDeletedIndexes] = useImmer<number[]>([])
  const [files, setFiles] = useImmer<Blob[]>([])
  const [newText, setNewText] = useState<string>()
  const { shopId } = useParams()
  const form = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setCurMaxIndex(props?.imgUrls?.length | 0)
  }, [props?.imgUrls])
  useEffect(() => {
    setNewImages([])
    setIndexes([])
    setNewText(undefined)
    setFiles([])
  }, [props.reset])

  const handleImgInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const index = Number(e.target.id)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImages((draft) => {
          draft[index] = reader.result as string
        })
        setFiles((draft) => {
          if (indexes.indexOf(index) !== -1) {
            draft[indexes.indexOf(index)] = file as Blob
          } else {
            draft.push(file)
          }
        })
        setIndexes((draft) => {
          if (indexes.indexOf(index) === -1) {
            draft.push(index)
          }
        })
        if (deletedIndexes.indexOf(index) !== -1) {
          setDeletedIndexes((draft) => draft.filter((i) => i !== index))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const dataToSend = new FormData()
    if (indexes.length > 0) {
      dataToSend.append("indexes", JSON.stringify(indexes))
    }
    if (newText) {
      dataToSend.append("text", newText)
    }
    if (shopId) {
      dataToSend.append("shopId", shopId)
    }
    if (indexes.length > 0 && files.length > 0) {
      for (const file of files) {
        dataToSend.append("images", file)
      }
    }

    if (props.sectionId) {
      putData(API + `/sections/${props.sectionId}`, dataToSend, {
        "Content-Type": "multipart/form-data",
      })
        .then((res: TSection) => {
          if (res) {
            props.setReset((prev) => !prev)
            form.current?.reset()
          }
        })
        .catch(() => {
          alert("Something went wrong")
        })
        .finally(() => {
          setIsSaving(false)
          props.setNewSection(false)
        })
    } else {
      postData(API + `/sections/${shopId}`, dataToSend, {
        "Content-Type": "multipart/form-data",
      })
        .then((res: TSection) => {
          if (res) {
            props.setReset((prev) => !prev)
            form.current?.reset()
          }
        })
        .catch(() => {
          alert("Something went wrong")
        })
        .finally(() => {
          setIsSaving(false)
          props.setNewSection(false)
        })
    }
  }

  const getCurrentImg = (index: number): string => {
    if (deletedIndexes.indexOf(index) === -1) {
      if (newImages[index]) {
        return newImages[index]
      } else if (props.imgUrls && props.imgUrls[index]) {
        return props.imgUrls[index]
      }
    }
    return "/assets/default-image.png"
  }

  const handleDeleteSection = async (_: React.MouseEvent<HTMLDivElement>) => {
    if (props.sectionId) {
      try {
        await deleteData(API + `/sections/${props.sectionId}`)
        props.setReset((prev) => !prev)
      } catch (error) {
        alert("Something went wrong")
      }
    } else {
      props.setNewSection(false)
    }
  }

  const handleDeleteImage = (index: number) => {
    setDeletedIndexes((draft) => {
      if (draft.indexOf(index) === -1) {
        if (indexes.indexOf(index) !== -1) {
          setIndexes((draft) => draft.filter((i) => i !== index))
          setFiles((draft) =>
            draft.filter((_, fileIndex) => fileIndex !== index)
          )
        }
        draft.push(index)
      }
    })
  }

  const images = []
  for (let i = 0; i < curMaxIndex; i++) {
    images.push(
      <div key={i} className="edit-image-container">
        <img src={getCurrentImg(i)} loading="lazy" alt="shop section image" />
        <input
          type="file"
          accept="image/*"
          id={i.toString()}
          onChange={handleImgInput}
          disabled={isSaving}
        />
        <div className="image-delete" onClick={() => handleDeleteImage(i)}>
          <img src="/assets/delete.svg" alt="delete image" />
        </div>
      </div>
    )
  }
  if (curMaxIndex < maxIndex) {
    images.push(
      <div
        className="add-image-button"
        key={curMaxIndex}
        onClick={() => {
          !isSaving ? setCurMaxIndex(curMaxIndex + 1) : null
        }}
      >
        <img src="/assets/cross.svg" loading="lazy" alt="add image" />
      </div>
    )
  }

  return (
    <form ref={form} className="shop-section" onSubmit={handleSubmit}>
      <div className="edit-section-image-grid">{images}</div>
      <div className="section-text-container">
        <textarea
          className="edit-section-text"
          disabled={isSaving}
          value={
            newText != undefined
              ? newText
              : props.text
              ? props.text
              : "Section text"
          }
          onChange={(e) => setNewText(e.target.value)}
        />
      </div>
      <div className="section-delete" onClick={handleDeleteSection}>
        <img src="/assets/delete.svg" alt="delete section" /> Delete Section
      </div>
      <input type="submit" className="section-submit" disabled={isSaving} />
    </form>
  )
}

export default EditSection
