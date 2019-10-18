export const actionCreator = type => payload => ({ type, payload })

export const requestStateBlueprint = {
  fetching: false,
  fetched: false,
  error: false,
  errorCode: null,
  errorMessage: null
}

export const requestBlueprint = {
  fetching: true,
  error: false
}

export const successBlueprint = {
  fetching: false,
  fetched: true,
  error: false,
  errorCode: null,
  errorMessage: null
}

export const failureBlueprint = {
  fetching: false,
  fetched: true,
  error: true
}
