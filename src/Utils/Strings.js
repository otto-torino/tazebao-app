export function capitalize (string) {
  if (!string) {
    return ''
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/*
 * Transform a capitalized string in its verbose form (from variable name to its verbose form):
 * - add spaces before each capitalized letter
 * - capitalize the first letter
 */
export function varToVerbose (string) {
  return capitalize(string.replace(/([A-Z])/, ' $1')).replace('_', ' ')
}
