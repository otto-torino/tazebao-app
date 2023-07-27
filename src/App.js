import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './App.css'
import Startup from './Components/Startup'
import StartupActions from './Redux/Startup'
import AppRouter from './Router'

// This is the main component, it includes the router which manages
// routing to different views.
// This is also the right place to declare components which should be
// displayed everywhere, i.e. sockets, services,...
function App() {
  const dispatch = useDispatch()
  const startupComplete = useSelector((state) => state.startup.complete)

  if (!startupComplete) {
    setTimeout(() => dispatch(StartupActions.startup()), 1000)
  }

  return (
    <div className="app" data-tour="app">
      <ToastContainer />
      {startupComplete ? <AppRouter /> : <Startup />}
    </div>
  )
}

export default App
