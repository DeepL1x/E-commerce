import { TSection } from "types"
import "./Section.scss"

type SectionProps = TSection & {
  editMode?: boolean
}

const Section = (props: SectionProps) => {
  const images = props.imgUrls.map((Url, index) => (
    <img key={index} src={Url} loading="lazy"  alt="section image" />
  ))
  return (
    <section className="shop-section">
      <div className="section-image-grid">{images}</div>
      <div className="section-text">{props.text}</div>
    </section>
  )
}

export default Section
