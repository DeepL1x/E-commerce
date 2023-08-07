import { TSection } from "types"
import "./Section.scss"

const Section = (props: TSection) => {
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
