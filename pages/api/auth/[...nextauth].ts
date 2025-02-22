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
      async authorize(credentials) {
        if (
          credentials?.email === "admin@cliniclane.com" &&
          credentials.password === "#cliniclane2024"
        ) {
          return {
            id: "1", // Required field for NextAuth
            email: credentials.email,
          };
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/login",
  },
  callbacks: {},
};

export default NextAuth(authOptions);
