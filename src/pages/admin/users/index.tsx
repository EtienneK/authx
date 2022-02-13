import NextLink from 'next/link'
import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Link from '../../../components/layouts/Link'
import { FiPlusCircle } from 'react-icons/fi'
import { ListPayload } from '../../../adapters'
import { UserWithId } from '../../../schemas/shared/admin'
import AdminLayout from '../../../components/layouts/AdminLayout'
import DataFetchDisplay from '../../../components/DataFetchDisplay'

const UserList = (
  { data }: { data: ListPayload<UserWithId> }
): React.ReactElement => {
  return (
    <>
      <NextLink href='/admin/users/create'>
        <Button leftIcon={<FiPlusCircle />} float='right'>
          Create new user
        </Button>
      </NextLink>

      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>email</Th>
            <Th>username</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.results.map((result: UserWithId, index: number) => (
            <Tr key={index}>
              <Td>
                <Link href={`/admin/users/${result.id}`}>{result.id}</Link>
              </Td>
              <Td>{result.email}</Td>
              <Td>{result.username}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>id</Th>
            <Th>email</Th>
            <Th>username</Th>
          </Tr>
        </Tfoot>
      </Table>
      <p>Total results: <strong>{data.total}</strong></p>
    </>
  )
}

const UsersList: NextPage = () => {
  return (
    <AdminLayout breadcrumbs={[]}>

      <Heading>Users</Heading>
      <DataFetchDisplay url='/api/admin/users' DisplayElement={UserList} />
    </AdminLayout>
  )
}

export default UsersList
