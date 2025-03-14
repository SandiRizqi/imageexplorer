import NextAuth from "next-auth"
import { authOptions } from "../../../components/auth/auth"

// Add this line to enable Edge Runtime
// export const runtime = 'edge'

// Export the handler functions using the App Router pattern
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }