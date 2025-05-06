// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('⭐ Auth attempt started with email:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          console.log('👤 User lookup result:', user ? 'User found' : 'User not found');
          
          if (!user) {
            console.log('❌ User not found in database');
            return null;
          }

          console.log('🔐 Comparing passwords...');
          const passwordMatch = await compare(credentials.password, user.hashedPassword);
          console.log('🔑 Password match result:', passwordMatch);

          if (!passwordMatch) {
            console.log('❌ Password does not match');
            return null;
          }

          console.log('✅ Authentication successful');
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('💥 Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  debug: true, // Turn on debugging
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('🎫 Creating JWT with user data:', { id: user.id, role: user.role });
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        console.log('👥 Creating session with token data:', { id: token.id, role: token.role });
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };