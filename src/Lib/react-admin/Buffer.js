import { useState, useEffect } from 'react'

function useBuffer (request, start, init, update, delayTime = 0) {
  const [buffer, setBuffer] = useState(init)
  const [next, setNext] = useState(start)
  useEffect(() => {
    if (next !== null) {
      request(next)
        .then(result => {
          setBuffer(update(buffer, result.data))
          setNext(result.next)
        })
        .catch(console.log) // TODO: manage error
    } // TODO: maybe manage component destruction trough useEffect return
  }, [next])
  return buffer
}

export function useBufferArray (request, start, delayTime = 0) {
  const init = []
  const update = (buffer, data) => [...buffer, ...data]
  return useBuffer(request, start, init, update, delayTime)
}

export function useBufferObject (request, start, delayTime = 0) {
  const init = {}
  const update = (buffer, data) => ({ ...buffer, ...data })
  return useBuffer(request, start, init, update, delayTime)
}

export default useBuffer
