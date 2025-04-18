import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Toast Container */}
        <ToastContainer />
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ConnectMyTask
          </Link>
          <nav>
            <Link
              href="/register"
              className="text-blue-600 hover:underline mx-4"
            >
              Register
            </Link>
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </nav>
        </header>
        <main>{children}</main>
        {/* Footer */}
        <footer className="bg-gray-900 text-white text-center py-6">
          <p>
            &copy; {new Date().getFullYear()} ConnectMyTask. All Rights
            Reserved.
          </p>
        </footer>
      </body>
    </html>
  )
}
