import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const db   = await getDb()
        const user = await db.collection('users').findOne({ email: credentials.email })
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password as string)
        if (!isValid) return null

        return {
          id:    user._id.toString(),
          email: user.email as string,
          name:  user.name  as string,
          image: (user.image as string | undefined) ?? null,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true

      try {
        const db       = await getDb()
        const existing = await db.collection('users').findOne({ email: user.email })

        if (existing) {
          await db.collection('users').updateOne(
            { email: user.email },
            { $set: { lastLogin: new Date(), image: user.image } },
          )
          user.id = existing._id.toString()
        } else {
          const result = await db.collection('users').insertOne({
            name:          user.name,
            email:         user.email,
            image:         user.image,
            provider:      'google',
            googleId:      account.providerAccountId,
            emailVerified: true,
            createdAt:     new Date(),
            lastLogin:     new Date(),
          })
          user.id = result.insertedId.toString()
        }
        return true
      } catch (err) {
        console.error('[NextAuth] Google signIn error:', err)
        return false
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
          // For Google sign-ins, user.id was set in the signIn callback above.
          // If it's missing (e.g. first-time race), look it up.
          if (user.id) {
            token.id = user.id
          } else {
            const db     = await getDb()
            const dbUser = await db.collection('users').findOne({ email: user.email })
            token.id     = dbUser?._id.toString() ?? ''
          }
        } else {
          token.id = user.id
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string
      return session
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
