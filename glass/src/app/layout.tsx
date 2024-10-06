import ThemeRegistry from '@/components/ThemeRegistry'

export const metadata = {
  title: 'Compass - Your Personal Journaling App',
  description: 'A simple and intuitive journaling app to capture your thoughts and experiences.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}