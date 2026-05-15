import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.scss'
import { Layout } from './routes/layout/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Layout />
    </>
  )
}

export default App
