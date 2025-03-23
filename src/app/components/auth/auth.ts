import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

// Extend JWT type
interface ExtendedJWT extends JWT {
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXT_AUTHSECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }): Promise<ExtendedJWT> {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          idToken: account.id_token, // Google ID Token (JWT)
          id: user.id,
          ...account
        }
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
        accessToken: token.accessToken,
        idToken: token.idToken,
      }
    },
  },
}