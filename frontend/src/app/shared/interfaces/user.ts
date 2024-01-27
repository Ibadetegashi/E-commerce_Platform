export interface User {
  id?: number
  firstname: string
  lastname: string
  email?: string
  isAdmin?: boolean
  confirmationToken?: any
  emailConfirmed?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Register {
  firstname: string
  lastname: string
  email: string
  password: string
}

