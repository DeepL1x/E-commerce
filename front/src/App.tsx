import "./App.scss"
import Header from "components/Header/Header"
import AllRoutes from "Routes/Routes"
import AuthContextProvider from "contexts/AuthContext"
import MobileContextProvider from "contexts/MobileContext"
import { BrowserRouter } from "react-router-dom"

function App() {
  return (
    <>
      <BrowserRouter>
        <MobileContextProvider>
          <AuthContextProvider>
            <Header />
            <AllRoutes />
          </AuthContextProvider>
        </MobileContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
