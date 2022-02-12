import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { ReactElement, ReactNode } from 'react'
import Link from 'next/link'
import SidebarWithHeader from './SidebarWithHeader'

interface BreadcrumbData {
  href: string
  label: string
}

export default function AdminLayout ({
  breadcrumbs,
  children
}: {
  breadcrumbs: BreadcrumbData[]
  children: ReactNode
}): ReactElement {
  return (
    <SidebarWithHeader>
      {breadcrumbs.length !== 0
        ? (
          <Breadcrumb>
            {breadcrumbs.map((bc, index) => (
              <BreadcrumbItem key={index} isCurrentPage={index === breadcrumbs.length - 1}>
                <Link passHref href={bc.href}>
                  <BreadcrumbLink>{bc.label}</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
          )
        : undefined}

      {children}
    </SidebarWithHeader>
  )
}
