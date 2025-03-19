import { Toaster } from "sonner"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/routes"

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App