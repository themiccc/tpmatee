import Link from 'next/link'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <nav className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-purple-600">TP Matee</h1>
        <div className="flex gap-4">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
                Dashboard
              </Link>
              <Link href="/discover" className="text-gray-700 hover:text-purple-600">
                Discover Mentors
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-700 hover:text-purple-600">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <h2 className="text-5xl font-bold text-white mb-6">Connect with Expert Mentors</h2>
        <p className="text-xl text-gray-100 mb-12 max-w-2xl text-center">
          Book 1:1 sessions with experienced professionals. Get guidance tailored to your goals.
        </p>
        {!isSignedIn && (
          <SignUpButton mode="modal">
            <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100">
              Get Started
            </button>
          </SignUpButton>
        )}
      </div>
    </div>
  )
}
