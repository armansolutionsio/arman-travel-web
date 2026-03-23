import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Arman Travel',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
