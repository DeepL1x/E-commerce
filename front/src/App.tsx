import "./App.scss"
import Header from "components/Header/Header"
import MainPage from "components/MainPage/MainPage"
import MobileContextProvider from "contexts/MobileContext"

function App() {
  return (
    <>
      <MobileContextProvider>
        <Header />
        <MainPage />
      </MobileContextProvider>
    </>
  )
}

export default App
