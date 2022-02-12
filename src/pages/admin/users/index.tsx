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
import useSWR from 'swr'
import fetch from 'cross-fetch'
import Link from '../../../components/layouts/Link'
import { FiPlusCircle } from 'react-icons/fi'
import React, { ReactElement } from 'react'
import Error from '../../../components/Error'
import { ListPayload } from '../../../adapters'
import { UserWithId } from '../../../schemas/db'
import AdminLayout from '../../../components/layouts/AdminLayout'

const fetcher = async (url: string): Promise<ListPayload<UserWithId>> => await fetch(url).then(async (res) => await res.json())

const DataTable = (
  { data }: { data: ListPayload<UserWithId> }
): React.ReactElement => {
  return (
    <>
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

interface DisplayElementProps {
  data: ListPayload<UserWithId>
}

const DataFetchDisplay = (
  { url, DisplayElement }: { url: string, DisplayElement: React.ComponentType<DisplayElementProps>}
): ReactElement => {
  const { data, error } = useSWR(
    url,
    fetcher
  )
  if (error != null) return <Error heading='Failed to fetch users' message='An unkown error has occured. Please try again later.' />
  if (data == null) return <>Loading...</>
  return <DisplayElement data={data} />
}

const UsersList: NextPage = () => {
  return (
    <AdminLayout>
      <NextLink href='/admin/users/create'>
        <Button leftIcon={<FiPlusCircle />} float='right'>
          Create new user
        </Button>
      </NextLink>
      <Heading>Users</Heading>
      <DataFetchDisplay url='/api/admin/users' DisplayElement={DataTable} />
    </AdminLayout>
  )
}

export default UsersList
