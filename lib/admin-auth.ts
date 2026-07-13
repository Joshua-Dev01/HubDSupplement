export const ADMIN_COOKIE_NAME = 'admin_session'

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function getExpectedAdminToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? ''
  const password = process.env.ADMIN_PASSWORD ?? ''
  return sha256(`${password}:${secret}`)
}