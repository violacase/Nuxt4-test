import type { ListUsersQuery } from '~/types/gql'

const LIST_USERS_QUERY = /* GraphQL */ `
  query ListUsers {
    listUsers {
      id
      email
      name
      avatarUrl
      role
      createdAt
    }
  }
`

export function useUsers() {
  const users = ref<ListUsersQuery['listUsers']>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: LIST_USERS_QUERY }),
      })
      const json = (await res.json()) as { data?: ListUsersQuery; errors?: { message: string }[] }
      if (json.errors?.length) throw new Error(json.errors[0].message)
      users.value = json.data?.listUsers ?? []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchUsers)

  return { users, isLoading, error, refresh: fetchUsers }
}
