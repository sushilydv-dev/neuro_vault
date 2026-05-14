import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { API_BASE } from "../utils/api"

const AuthContext = createContext(null)

const TOKEN_KEY = 'token'
async function verifyToken(token) {
  const res = await fetch(`${API_BASE}/verify`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  }) 
  return res.ok
}

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('checking') 
  const lastVerifiedRef = useRef(0)

  const refresh = useCallback(
    async ({ silent = false } = {}) => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        lastVerifiedRef.current = 0
        setStatus('unauthenticated')
        return
      }

      const now = Date.now()
      if (now - lastVerifiedRef.current < 2000) {
        setStatus('authenticated')
        return
      }
 
      if (!silent) setStatus('checking')

      try {
        const ok = await verifyToken(token)
        if (!ok) {
          localStorage.removeItem(TOKEN_KEY)
          lastVerifiedRef.current = 0
          setStatus('unauthenticated')
          return
        }
        lastVerifiedRef.current = now
        setStatus('authenticated')
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        lastVerifiedRef.current = 0
        setStatus('unauthenticated')
      }
    },
    []
  )

  const setToken = useCallback((token) => {
    if (!token) return
    localStorage.setItem(TOKEN_KEY, token)
    lastVerifiedRef.current = Date.now()
    setStatus('authenticated')
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    lastVerifiedRef.current = 0
    setStatus('unauthenticated')
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      status,
      token: typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
      refresh,
      setToken,
      logout,
    }),
    [logout, refresh, setToken, status]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
