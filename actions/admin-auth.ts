'use server'

import { cookies } from 'next/headers'
import { getExpectedAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

export async function adminLogin(password: string) {
  if (!process.env.ADMIN_PASSWORD) {
    return { error: 'Admin login is not configured' }
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Incorrect password' }
  }

  const token = await getExpectedAdminToken()
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hour session
  })

  return { success: true }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
  return { success: true }
}