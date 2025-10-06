import { useCallback } from 'react'

export const useFormNavigation = (onSubmit: (e: React.FormEvent) => void) => {
    const handleKeyDown = useCallback((e: React.KeyboardEvent, nextField?: string) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (nextField) {
                const nextElement = document.getElementById(nextField)
                nextElement?.focus()
            } else {
                onSubmit(e as any)
            }
        }
    }, [onSubmit])

    return { handleKeyDown }
}
