import { actionCreator } from './Utils'

// Type
export const OPEN_TOUR = 'OPEN_TOUR'
export const CLOSE_TOUR = 'CLOSE_TOUR'

// Actions
export default {
  openTour: actionCreator(OPEN_TOUR),
  closeTour: actionCreator(CLOSE_TOUR)
}

// Initial state
export const INITIAL_STATE = {
  isOpen: false,
  name: null
}

// Reducers
const openTour = (state, name) => (Object.assign({}, state, { isOpen: true, name }))
const closeTour = state => (Object.assign({}, state, { isOpen: false }))

export function reducer (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case OPEN_TOUR:
      return openTour(state, payload)
    case CLOSE_TOUR:
      return closeTour(state)
    default:
      return state
  }
}
