import { Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import SidebarWithHeader from '../../components/layouts/SidebarWithHeader'

const Home: NextPage = () => {
  return (
    <SidebarWithHeader>
      <Heading>Dashboard</Heading>
    </SidebarWithHeader>
  )
}

export default Home
