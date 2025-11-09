// Admin authentication credentials
export const ADMIN_CREDENTIALS = [
  { username: 'ajay', password: 'ajayadmin@98', name: 'Ajay' },
  { username: 'pratham', password: 'prathamadmin80', name: 'Pratham' },
  { username: 'shree', password: 'shreeadmin01', name: 'Shree' },
]

export function validateAdminCredentials(username: string, password: string): boolean {
  return ADMIN_CREDENTIALS.some(
    admin => admin.username === username && admin.password === password
  )
}

export function getAdminName(username: string): string | null {
  const admin = ADMIN_CREDENTIALS.find(a => a.username === username)
  return admin ? admin.name : null
}
