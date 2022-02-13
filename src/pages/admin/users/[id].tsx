import { Code, Container, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Error from '../../../components/Error'
import AdminLayout from '../../../components/layouts/AdminLayout'
import { UserWithId } from '../../../schemas/shared/admin'

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
    <AdminLayout breadcrumbs={[
      { href: '/admin/users', label: 'Users' },
      { href: `/admin/users/${data.id}`, label: data.username }
    ]}
    >
      <Container>
        <Heading>{data.username}</Heading>
        <Code whiteSpace='pre' display='block' mt={5}>
          {JSON.stringify(data, null, 2)}
        </Code>
      </Container>
    </AdminLayout>
  )
}

export default UserView
