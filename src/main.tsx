import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { initMonitoring } from "@/monitoring"
import App from "@/App"
import "@/index.css"

initMonitoring()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
