import { useState, useContext } from "react"
import "./SigninPage.scss"
import { redirect, useNavigate } from "react-router-dom"
import { AuthContext } from "contexts/AuthContext"

const SigninPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signIn } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const handleFromSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signIn(email, password).then((res) => {
      if (res) {
        navigate("/")
      }
    })
  }

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleFromSubmit}
      className="sign-in-form-container"
    >
      <input
        type="email"
        name="email"
        placeholder="email@email.com"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" value="Sign in!" />
    </form>
  )
}

export default SigninPage
