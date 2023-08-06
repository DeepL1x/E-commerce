import express from "express"
import router from "./routes"
import "express-async-errors"
import dotenv from "dotenv"
import { auth } from "./middlewares/auth"
import { errorHandlerMiddleware } from "./middlewares/errorHandler"
import { StatusCodes } from "http-status-codes"
dotenv.config()

const app = express()



app.use(`/${process.env.SERVER_URL}`, router())
app.get(
  `/${process.env.SERVER_URL}/hello`,
  auth,
  (req: express.Request, res: express.Response) => res.status(StatusCodes.OK)
)

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
