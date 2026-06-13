import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Polyclinique Cité Nassib — Pilotage de Chantier",
  description: "Système de gestion et de pilotage du chantier de la Polyclinique Cité Nassib",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-background antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
            },
          }}
        />
      </body>
    </html>
  )
}
