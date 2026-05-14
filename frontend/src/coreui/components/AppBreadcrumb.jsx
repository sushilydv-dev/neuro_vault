import React from 'react'
import { useLocation } from 'react-router-dom'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {currentLocation === '/workspace' ? (
        <CBreadcrumbItem active>Workspace</CBreadcrumbItem>
      ) : (
        <CBreadcrumbItem href="/workspace">Workspace</CBreadcrumbItem>
      )}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
