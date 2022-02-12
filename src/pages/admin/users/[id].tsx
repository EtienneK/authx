import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Code, Container, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Error from '../../../components/Error'
import AdminLayout from '../../../components/layouts/AdminLayout'
import { UserWithId } from '../../../schemas/db'

const fetcher = async (url: string): Promise<UserWithId> => await fetch(url).then(async (res) => await res.json())

const UserView: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const { data, error } = useSWR(
    `/api/admin/users/${id as string}`,
    fetcher
  )
  if (error != null) return <Error heading='Failed to fetch user' message='An unkown error has occured. Please try again later.' />
  if (data == null) return <>Loading...</>

  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link passHref href='/admin/users'>
            <BreadcrumbLink>Users</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link passHref href={`/admin/users/${data.id}`}>
            <BreadcrumbLink>{data.username}</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Container>
        <Heading>{data.username}</Heading>
        <pre><Code>{JSON.stringify(data, null, 2)}</Code></pre>
      </Container>
    </AdminLayout>
  )
}

export default UserView
