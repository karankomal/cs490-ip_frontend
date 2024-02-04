import Navbar from "./Navbar";
import Home from "./pages/Home"
import Films from "./pages/Films"
import Customers from "./pages/Customers"
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>
    </>
  )
}

export default App;