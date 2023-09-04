import './App.css'
import { Routes } from './routes'
import { AuthProvider } from './contexts/Auth'
import { BrowserRouter } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  )
}
