import { useState } from 'react'

import './App.css'
import Currencyconverter from './components/Currencyconverter'
import Cryptoconverter from './components/Cryptoconverter'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>

  <div className='min-h-screen bg-gray-400 flex flex-col justify-center items-center' >
  <Currencyconverter/>

  </div>


    </>
  )
}

export default App
