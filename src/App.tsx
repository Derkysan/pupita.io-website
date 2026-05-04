import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/routers'

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
