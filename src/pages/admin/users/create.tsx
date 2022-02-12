import { useForm } from 'react-hook-form'
import {
  Button,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Heading,
  Input,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import fetch from 'cross-fetch'
import { User, userSchema } from '../../../schemas/db'
import AdminLayout from '../../../components/layouts/AdminLayout'
import { useState } from 'react'

const UsersCreate: NextPage = () => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<User>({
    resolver: yupResolver(userSchema)
  })

  const [showUnknownError, setShowUnknownError] = useState(false)

  const router = useRouter()

  const onSubmit = async (values: User): Promise<void> => {
    setShowUnknownError(false)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })

    if (res.status !== 201) {
      if (res.status === 400) {
        const err = await res.json()
        if (err?.fieldValidationErrors != null) {
          for (const [key, value] of Object.entries<any>(err.fieldValidationErrors)) {
            setError(key as keyof User, value)
          }
        } else {
          setShowUnknownError(true)
        }
      } else {
        setShowUnknownError(true)
      }
      return
    }

    const { id } = await res.json()

    await router.push(`/admin/users/${id as string}`)
  }

  return (
    <AdminLayout breadcrumbs={[
      { href: '/admin/users', label: 'Users' },
      { href: '/admin/users/create', label: 'Create new user' }
    ]}
    >
      <Alert status='error' mt={5} mb={5} hidden={!showUnknownError}>
        <AlertIcon />
        <AlertTitle mr={2}>An unknown error has occured.</AlertTitle>
        <AlertDescription>Please try again later.</AlertDescription>
        <CloseButton position='absolute' right='8px' top='8px' onClick={() => setShowUnknownError(false)} />
      </Alert>

      <Container>
        <Heading>Create new user</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>

          <FormControl isInvalid={errors.username != null}>
            <FormLabel htmlFor='username'>Username</FormLabel>
            <Input
              id='username'
              placeholder='Username'
              {...register('username')}
            />
            <FormErrorMessage>
              {errors?.username?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email != null}>
            <FormLabel htmlFor='email'>Email address</FormLabel>
            <Input
              id='email'
              placeholder='Email address'
              type='email'
              {...register('email')}
            />
            <FormErrorMessage>
              {errors?.email?.message}
            </FormErrorMessage>
          </FormControl>

          <Button mt={4} isLoading={isSubmitting} type='submit'>
            Create
          </Button>

        </form>
      </Container>
    </AdminLayout>
  )
}

export default UsersCreate
