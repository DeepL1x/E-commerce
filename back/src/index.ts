import express from "express"
import router from "./routes"
import "express-async-errors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { auth } from "./middlewares/auth"
import { errorHandlerMiddleware } from "./middlewares/error-handler"
dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1", router())
app.get("/api/v1/hello", auth, (req: express.Request, res: express.Response) =>
  res.send(
    // @ts-ignore
    req.user
  )
)

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`server is listening on port ${port}...`)
    )
  } catch (error)   {
    console.log(error)
  }
}

start()