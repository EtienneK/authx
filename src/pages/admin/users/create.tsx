import { useForm } from 'react-hook-form'
import {
  Button,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Heading,
  Input,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import fetch from 'cross-fetch'
import SidebarWithHeader from '../../../components/layouts/SidebarWithHeader'
import { User, userSchema } from '../../../schemas/db'
import Link from 'next/link'

const UsersCreate: NextPage = () => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<User>({
    resolver: yupResolver(userSchema)
  })

  const router = useRouter()

  const onSubmit = async (values: User): Promise<void> => {
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
          // Unknown error
          // TODO
          throw Error('UNKNOWN ERROR')
        }
      } else {
        // Unknown error
        // TODO
        throw Error('UNKNOWN ERROR')
      }
      return
    }

    const { id } = await res.json()

    await router.push(`/admin/users/${id as string}`)
  }

  return (
    <SidebarWithHeader>

      <Breadcrumb>
        <BreadcrumbItem>
          <Link passHref href='/admin/users'>
            <BreadcrumbLink>Users</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link passHref href='/admin/users/create'>
            <BreadcrumbLink>Create new user</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>

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

          <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
            Create
          </Button>

        </form>
      </Container>
    </SidebarWithHeader>
  )
}

export default UsersCreate
