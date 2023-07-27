import { useState } from "react"
import SigninPage from "./SigninPage/SigninPage"
import "./AuthPage.scss"
import SignupPage from "./SignupPage/SignupPage"

const AuthPage = () => {
  const [isNew, setIsNew] = useState(false)

  return (
    <div className="auth-container">
      {isNew ? <SignupPage /> : <SigninPage />}
      <div className="auth-method-button" onClick={() => setIsNew(!isNew)}>
        {isNew
          ? "Already have an account? Sign in!"
          : "Do not have an account? Sign up!"}
      </div>
    </div>
  )
}

export default AuthPage
