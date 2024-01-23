import NextAuth, { Account, Session, NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import nodemailer from 'nodemailer';
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import prisma from "@/utils/db";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                // username: { label: "Username", type: "text", placeholder: "username" },
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials?.email
                    }
                })

                if (user) {
                    return user
                } else {
                    return null
                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account }: { token: JWT, account: Account | null }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token, user }: { session: Session, token: JWT, user: AdapterUser }) {
            // Send properties to the client, like an access_token from a provider.
            // token.accessToken = token.sub
            return session
        }
    }
} satisfies NextAuthOptions;

export default NextAuth(authOptions)