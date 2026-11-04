import { useCallback, useEffect, useState } from 'react'
import { checkSession, login as apiLogin, logout as apiLogout, onUnauthorized } from '@/admin/api'

export type AuthStatus = 'checking' | 'authenticated' | 'anonymous'

export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>('checking')
  // Passe à true quand la session expire en cours d'utilisation (401 renvoyé par l'API).
  const [expired, setExpired] = useState(false)

  useEffect(
    () =>
      onUnauthorized(() => {
        setExpired(true)
        setStatus('anonymous')
      }),
    []
  )

  useEffect(() => {
    checkSession()
      .then(authenticated => setStatus(authenticated ? 'authenticated' : 'anonymous'))
      .catch(() => setStatus('anonymous'))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await apiLogin(email, password)
    setExpired(false)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      setStatus('anonymous')
    }
  }, [])

  return { status, expired, login, logout }
}
