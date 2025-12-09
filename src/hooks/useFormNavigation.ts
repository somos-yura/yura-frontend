import { useCallback } from 'react'

export const useFormNavigation = (onSubmit: (e: React.FormEvent) => void) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, nextField?: string) => {
      if (e.key !== 'Enter') return

      e.preventDefault()
      if (!nextField) {
        onSubmit(e as unknown as React.FormEvent)
        return
      }

      const nextElement = document.getElementById(nextField)
      nextElement?.focus()
    },
    [onSubmit]
  )

  return { handleKeyDown }
}
