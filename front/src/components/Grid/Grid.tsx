import "./Grid.scss"
import { PropsWithChildren } from "react"

type GridProps = {
  title: string
}

const Grid = (props: PropsWithChildren<GridProps>) => {
  return (
    <div className="grid-container">
      <span>{props.title}</span>
      <div className="grid-content">{props.children}</div>
    </div>
  )
}

export default Grid
