import { AxiosError } from "axios"
import { AuthContext } from "contexts/AuthContext"
import { PropsWithChildren, useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getData } from "utils/requests"

const API = import.meta.env.VITE_API_URL

const ProtectedRoute = (props: PropsWithChildren) => {
  const { user } = useContext(AuthContext)
  const { shopId } = useParams()
  const [allowed, setAllowed] = useState(false)
  const navigate = useNavigate()

  if (!user) {
    navigate("/auth")
  }
  useEffect(() => {
    if (user && shopId) {
      getData(API + `/shops/get-access-status/${shopId}`)
        .then(() => {
          setAllowed(true)
        })
        .catch((error: AxiosError) => {
          if ((error.status = 401)) {
            navigate("/auth")
          }
        })
    }
  }, [shopId])
  return <>{allowed && props.children}</>
}

export default ProtectedRoute
