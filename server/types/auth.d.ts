// Augment nuxt-auth-utils User interface with the app's user shape.
// This type is used by setUserSession / getUserSession / requireUserSession.
// Keep in sync with the fields you store in setUserSession in your OAuth handler.

declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name: string
    avatarUrl: string | null
    role: 'admin' | 'member' | 'guest'
  }
}

export {}
