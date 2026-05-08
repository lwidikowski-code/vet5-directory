
export const metadata = {
  title: 'Vet5 Directory',
  description: 'Veteran Service Animal Directory'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
