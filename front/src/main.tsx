import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.scss"
import { getData } from "utils/requests.ts"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const API_URL = import.meta.env.VITE_API_URL;

(async () => {
  const { publishableKey } = await getData(`${API_URL}/payments/config`)
  const stripePromise = loadStripe(publishableKey)

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </React.StrictMode>
  )
})()
