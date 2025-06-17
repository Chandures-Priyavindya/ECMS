import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { routes } from "./routes"
import "./index.css"


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
