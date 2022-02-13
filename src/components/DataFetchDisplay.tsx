import { ReactElement } from 'react'
import useSWR from 'swr'
import Error from './Error'

const fetcher = async <T,>(url: string): Promise<T> => await fetch(url).then(async (res) => await res.json())

export interface DisplayElementProps<T> {
  data: T
}

export default function DataFetchDisplay<T> (
  { url, DisplayElement }: { url: string, DisplayElement: React.ComponentType<DisplayElementProps<T>>}
): ReactElement {
  const { data, error } = useSWR<T>(
    url,
    fetcher
  )
  if (error != null) {
    return (
      <Error
        heading='Failed to fetch data'
        message='An unkown error has occured while trying to fetch the requested data. Please try again later.'
      />
    )
  }
  if (data == null) return <>Loading...</>
  return <DisplayElement data={data} />
}
