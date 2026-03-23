import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'arman-secret-key-super-secure-2024'
)

export async function createToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function validateCredentials(user: string, password: string) {
  const validUser = process.env.ADMIN_USER || 'admin'
  const validPass = process.env.ADMIN_PASSWORD || 'arman123'
  return user === validUser && password === validPass
}
