import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // @ts-expect-error:""
      async authorize(credentials) {
        console.log({
          email: credentials?.email,
          password: credentials?.password,
        });
        try {
          const URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/api/auth/login";
          const res = await fetch(URL, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await res.json();

          // If no error and we have user data, return it
          if (res.ok && data) {
            return {
              id: data.id,
              email: data.email,
              role: data.role,
            };
          }
          // If the credentials are invalid, return null
          if (res.status === 400) {
            throw new Error("Invalid credentials");
          }
          // If the user is not found, return null
          if (res.status === 404) {
            throw new Error("User not found");
          }
          // If the user is not authorized, return null
          if (res.status === 401) {
            throw new Error("Unauthorized");
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/login",
  },
  callbacks: {
    // @ts-expect-error:""
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Add role to JWT token
      }
      return token;
    },
    // @ts-expect-error:""
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role; // Add role to session
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
