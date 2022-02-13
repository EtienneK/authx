import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Code,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import fetch from 'cross-fetch'
import DataFetchDisplay from '../../../components/DataFetchDisplay'
import AdminLayout from '../../../components/layouts/AdminLayout'
import { UserWithId } from '../../../schemas/shared/admin'

const DeleteConfirm = (
  { isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: UserWithId }
): React.ReactElement => {
  const [isDeleting, setDeleting] = useState(false)
  const router = useRouter()

  async function deleteUser (): Promise<void> {
    setDeleting(true)
    await fetch(`/api/admin/users/${user.id}`, {
      method: 'DELETE'
    })
    await router.replace('/admin/users')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status='warning'>
            <AlertIcon />
            <AlertDescription>
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            </AlertDescription>
          </Alert>
          <Text mt={5}>You are about to delete user with ID:</Text>
          <Text><strong>{user.id}</strong></Text>
        </ModalBody>

        <ModalFooter>
          <Button onClick={deleteUser} colorScheme='red' mr={3} isLoading={isDeleting}>
            Yes, delete them
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const UserDisplay = (
  { data }: { data: UserWithId }
): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} colorScheme='red' leftIcon={<FiTrash2 />} float='right'>
        Delete
      </Button>
      <DeleteConfirm isOpen={isOpen} onClose={onClose} user={data} />

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
