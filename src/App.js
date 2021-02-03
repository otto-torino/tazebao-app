import React from 'react'
import AppRouter from './Router'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import StartupActions from './Redux/Startup'
import TourActions from './Redux/Tour'
import Startup from './Components/Startup'
// tour
import Steps from './Tour'
import Tour from './Reactour'
// import Tour from 'reactour'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// This is the main component, it includes the router which manages
// routing to different views.
// This is also the right place to declare components which should be
// displayed everywhere, i.e. sockets, services,...
function App () {
  const dispatch = useDispatch()
  const startupComplete = useSelector(state => state.startup.complete)
  const tourIsOpen = useSelector(state => state.tour.isOpen)
  const tourName = useSelector(state => state.tour.name)
  const disableBody = target => disableBodyScroll(target)
  const enableBody = target => enableBodyScroll(target)

  if (!startupComplete) {
    setTimeout(() => dispatch(StartupActions.startup()), 1000)
  }

  return (
    <div className='app' data-tour='app'>
      <ToastContainer />
      {startupComplete ? <AppRouter /> : <Startup />}
      <Tour
        dispatch={dispatch}
        steps={Steps[tourName]}
        isOpen={tourIsOpen}
        showNavigation={false}
        showButtons={false}
        disableKeyboardNavigation
        onRequestClose={() => dispatch(TourActions.closeTour())}
        onAfterOpen={disableBody}
        onBeforeClose={enableBody}
      />
    </div>
  )
}

export default App
