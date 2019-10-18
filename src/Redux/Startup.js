import { actionCreator } from './Utils'

// Type
export const STARTUP = 'STARTUP'
export const STARTUP_COMPLETE = 'STARTUP_COMPLETE'

// Actions
export default {
  startup: actionCreator(STARTUP),
  startupComplete: actionCreator(STARTUP_COMPLETE)
}

// Initial state
export const INITIAL_STATE = {
  complete: false
}

// Reducers
const startup = state => state
const startupComplete = state => ({ complete: true })

export function reducer (state=INITIAL_STATE, { type, payload }) {
  switch(type) {
    case STARTUP:
      return startup(state)
    case STARTUP_COMPLETE:
      return startupComplete(state, payload)
    default:
      return state
  }
}
