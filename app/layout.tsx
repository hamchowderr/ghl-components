import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GHL Components",
  description: "A shadcn/ui component registry for GoHighLevel integrations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
