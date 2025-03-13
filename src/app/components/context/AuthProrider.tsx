'use client'

import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import { createContext, useContext, useEffect, useState } from 'react'
import LoadingScreen from '../LoadingScreen'
import { Session } from 'next-auth'

interface AuthContextType {
  session: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated' | string
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProviders({ 
  children,
  session
}: { 
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider session={session}>
      <AuthProviderContent>
        {children}
      </AuthProviderContent>
    </SessionProvider>
  )
}

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() // Add this line to get session status
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: window.location.href })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: window.location.href })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value = {
    session, // Use the actual session
    status, // Use the actual status from useSession
    signIn: handleSignIn,
    signOut: handleSignOut,
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider')
  }
  return context
}