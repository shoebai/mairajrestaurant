import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<MenuPage />} />
    </Routes>
  )
}
