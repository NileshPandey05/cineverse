import CredentialsProvider from "next-auth/providers/credentials"
import { CredentialSchema } from "./types"
import prisma from "./prisma"
import bcrypt from "bcrypt"


export const AuthOption = {
    providers:[
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                name: { label: "Name", type: "text", placeholder: "Username"},
                email: { label: "Email", type: "text", placeholder: "xyz@gmail.com" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                try{
                    const parsed = CredentialSchema.safeParse(credentials);
                    if (!parsed.success) throw new Error("Invalid credentials format");

                    const { name, email, password } = parsed.data;

                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })

                    if(!user){
                        const hashedPassword = await bcrypt.hash(password, 10)

                        const createUser = await prisma.user.create({
                            data: {
                                name, 
                                email,
                                password: hashedPassword
                            }
                        }) 
                        return { id: createUser.id, name: createUser.name, email: createUser.email };
                    }

                    const isPasswordValid = await bcrypt.compare(password, user.password)

                    if (!isPasswordValid) {
                        throw new Error("Invalid email or password");
                    }

                    return { id: user.id, name: user.name, email: user.email };
                }catch (err) {
                    console.error("Auth Error:", err);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/signup',
    },
    callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      console.log(token)
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      console.log(session)
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
}