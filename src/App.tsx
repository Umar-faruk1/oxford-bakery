import { Toaster } from "sonner"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/routes"

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  )
}

export default App