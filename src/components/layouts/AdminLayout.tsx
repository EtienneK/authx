import { ReactElement, ReactNode } from 'react'
import SidebarWithHeader from './SidebarWithHeader'

export default function AdminLayout ({
  children
}: {
  children: ReactNode
}): ReactElement {
  return (
    <SidebarWithHeader>
      {children}
    </SidebarWithHeader>
  )
}
