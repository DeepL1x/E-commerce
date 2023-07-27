import { useContext, useState } from "react"
import "./SignupPage.scss"
import {  useNavigate } from "react-router-dom"
import { AuthContext } from "contexts/AuthContext"

const SignupPage = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const apiURL = import.meta.env.VITE_API_URL
  const { signUp } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleFromSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    signUp(email, username, password).then((res) => {
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
        type="text"
        name="username"
        placeholder="username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" value="Sign up!" />
    </form>
  )
}

export default SignupPage
