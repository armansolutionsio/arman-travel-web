import { NextResponse } from 'next/server'
import { createToken, validateCredentials } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (!validateCredentials(username, password)) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const token = await createToken(username)

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return response
}
