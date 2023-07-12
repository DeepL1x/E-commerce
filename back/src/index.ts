import express from "express"
import router from "./routes"
import "express-async-errors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { auth } from "./middlewares/auth"
import { errorHandlerMiddleware } from "./middlewares/error-handler"
import cors from "cors"
dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use(`/${process.env.API_URL}`, router())
app.get(`/${process.env.API_URL}/hello`, auth, (req: express.Request, res: express.Response) =>
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