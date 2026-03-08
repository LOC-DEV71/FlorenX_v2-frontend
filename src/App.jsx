import { Toaster } from 'react-hot-toast'
import './App.css'
import AppRoutes from './routes'

function App() {

  return (
    <>
      <AppRoutes/>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </>
  )
}

export default App
