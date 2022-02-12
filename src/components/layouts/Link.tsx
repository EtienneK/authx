import { ReactElement } from 'react'
import NextLink from 'next/link'
import { Link as CLink, LinkProps as CLinkProps } from '@chakra-ui/react'

export interface LinkProps extends Omit<CLinkProps, 'href'> {
  href: string
}

export default function Link ({
  children, href, ...rest
}: LinkProps): ReactElement {
  return (
    <NextLink href={href} passHref>
      <CLink {...rest}>{children}</CLink>
    </NextLink>
  )
}
