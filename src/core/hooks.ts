import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

export const useDebouncedCallback = <TArgs extends unknown[]>(callback: (...args: TArgs) => void, delayMs = 300) => {
  const callbackRef = useRef(callback)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useLayoutEffect(() => {
    callbackRef.current = callback
  })

  useEffect(
    () => () => {
      clearTimeout(timerRef.current)
    },
    [],
  )

  return useCallback(
    (...args: TArgs) => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delayMs)
    },
    [delayMs],
  )
}
