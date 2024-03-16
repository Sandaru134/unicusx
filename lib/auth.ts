import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { compare } from "bcrypt";


export const authOption: NextAuthOptions = {
    adapter:PrismaAdapter(db),
    secret:process.env.NEXTAUTH_SECRET,
    session:{
        strategy:'jwt'
    },
    pages:{
        signIn:'/login'
    },

    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: {},
            password: {},

          },
          async authorize(credentials) {
            if(!credentials?.username || !credentials?.password){
                return null
            }
            const  existingUser = await db.user.findUnique({
                where: {
                    username: credentials?.username
                }
            })
            if(!existingUser){
                return null
            }

            const  passwordMatch = await compare(credentials.password, existingUser.password)
            if(!passwordMatch){
                return null
            }


            return {
                username: existingUser.username,
                image:existingUser.image_url,
                prefix:existingUser.prefix,
                name:existingUser.name
            }
          }
        })
      ],
      callbacks:{
        async jwt({ token, user }) {
            if(user){
                return{
                    ...token,
                    username:user.username,
                     prefix:user.prefix
                }
            }
            return token
          },
        async session({ session, user, token }) {
            return {
                ...session,
                user:{
                    ...session.user,
                    index:token.username,
                     prefix:token.prefix
                }
                
            }
            return session
          }
          
      }
}