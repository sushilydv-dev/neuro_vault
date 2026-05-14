import React, { createContext, useContext, useMemo, useState } from 'react'

const LayoutContext = createContext(null)

export const LayoutProvider = ({ children }) => {
  const [sidebarShow, setSidebarShow] = useState(true)
  const [sidebarUnfoldable, setSidebarUnfoldable] = useState(false)

  const value = useMemo(
    () => ({
      sidebarShow,
      setSidebarShow,
      sidebarUnfoldable,
      setSidebarUnfoldable,
    }),
    [sidebarShow, sidebarUnfoldable],
  )

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export const useLayout = () => {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider')
  return ctx
}

