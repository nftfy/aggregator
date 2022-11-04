import { useRouter } from 'next/router'

export const useRouteParams = () => {
  const router = useRouter()

  const setItem = (key: string, value: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, [key]: value }
    })
  }

  const getItem = (key: string) => {
    return router.query[key]
  }

  const removeItem = (key: string) => {
    router.push({
      pathname: router.pathname,
      query: { [key]: undefined }
    })
  }

  const clear = () => {
    router.push({
      pathname: router.pathname,
      query: {}
    })
  }

  return { setItem, getItem, removeItem, clear }
}
