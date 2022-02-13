import { Button, Code, Container, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FiTrash2 } from 'react-icons/fi'
import DataFetchDisplay from '../../../components/DataFetchDisplay'
import AdminLayout from '../../../components/layouts/AdminLayout'
import { UserWithId } from '../../../schemas/shared/admin'

const UserDisplay = (
  { data }: { data: UserWithId }
): React.ReactElement => {
  return (
    <>
      <Button colorScheme='red' leftIcon={<FiTrash2 />} float='right'>
        Delete
      </Button>
      <Heading>{data.username}</Heading>
      <Code whiteSpace='pre' display='block' mt={5}>
        {JSON.stringify(data, null, 2)}
      </Code>
    </>
  )
}

const UserView: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <AdminLayout breadcrumbs={[
      { href: '/admin/users', label: 'Users' },
      { href: `/admin/users/${id as string}`, label: id as string }
    ]}
    >
      <Container>
        <DataFetchDisplay url={`/api/admin/users/${id as string}`} DisplayElement={UserDisplay} />
      </Container>
    </AdminLayout>
  )
}

export default UserView
