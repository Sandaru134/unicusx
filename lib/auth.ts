import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import { compare } from 'bcrypt';
import { CustomUser } from '../app/types/next-auth';

export const authOption: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {},
                password: {},
            },
            async authorize(credentials): Promise<CustomUser | null> {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const prefix = credentials.username.slice(0, 3);

                if (prefix === 'USX') {
                    const existingUser = await db.unicus_admin.findUnique({
                        where: {
                            username: credentials?.username,
                        },
                    });
                    if (!existingUser) {
                        return null;
                    }

                    const passwordMatch = await compare(credentials.password, existingUser.password);
                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: existingUser.username,
                        index: existingUser.username,
                        username: existingUser.username,
                        prefix: prefix,
                        name: existingUser.name,
                    };
                }

                if (prefix === 'USH') {
                    const existingUser = await db.institute_admin.findUnique({
                        where: {
                            index: credentials?.username,
                        },
                        include: {
                            institutes: true,
                        },
                    });
                    if (!existingUser) {
                        return null;
                    }

                    const passwordMatch = await compare(credentials.password, existingUser.password);
                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: existingUser.institute_id,
                        index: existingUser.index,
                        username: existingUser.institute_id,
                        prefix: prefix,
                        name: existingUser.institutes.institute_name,
                    };
                }

                if (prefix === 'USP') {
                    const existingUser = await db.principals.findUnique({
                        where: {
                            index: credentials?.username,
                        },
                    });
                    if (!existingUser) {
                        return null;
                    }

                    const passwordMatch = await compare(credentials.password, existingUser.password);
                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: existingUser.institute_id,
                        index: existingUser.index,
                        username: existingUser.principal_id,
                        prefix: prefix,
                        name: existingUser.full_name,
                    };
                }

                if (prefix === 'UST') {
                    const existingUser = await db.teachers.findUnique({
                        where: {
                            index: credentials?.username,
                        },
                    });
                    if (!existingUser) {
                        return null;
                    }

                    const passwordMatch = await compare(credentials.password, existingUser.password);
                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: existingUser.institute_id,
                        index: existingUser.index,
                        username: existingUser.teacher_id,
                        prefix: prefix,
                        name: existingUser.full_name,
                    };
                }

                if (prefix === 'USS') {
                    const existingUser = await db.students.findUnique({
                        where: {
                            index: credentials?.username,
                        },
                    });
                    if (!existingUser) {
                        return null;
                    }

                    if (existingUser.nic) {
                        const passwordMatch = await compare(credentials.password, existingUser.nic);
                        if (passwordMatch) {
                            return {
                                id: existingUser.institute_id,
                                index: existingUser.index,
                                username: existingUser.student_id,
                                prefix: prefix,
                                name: existingUser.full_name,
                            };
                        }
                    }

                    const passwordMatch = await compare(credentials.password, existingUser.guardian_nic);
                    if (passwordMatch) {
                        return {
                            id: existingUser.institute_id,
                            index: existingUser.index,
                            username: existingUser.student_id,
                            prefix: prefix,
                            name: existingUser.full_name,
                        };
                    }
                    return null;
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    username: user.username,
                    prefix: user.prefix,
                    institute_id:user.id
                };
            }
            return token;
        },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.username,
                    prefix: token.prefix,
                    institute_id:token.institute_id

                },
            };
            return session;
        },
    },
};
