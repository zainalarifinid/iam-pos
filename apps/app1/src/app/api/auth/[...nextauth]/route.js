import NextAuth from "next-auth";
// import KeycloakProvider from "next-auth/providers/keycloak";

console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL);
console.log("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET);

const authOptions = {
  providers: [
    // KeycloakProvider({
    //   id: "keycloak",
    //   clientId: "posoidc",
    //   clientSecret: process.env.NEXTAUTH_SECRET,
    //   scope: "openid profile email",
    //   issuer: "http://10.1.1.10:8082/auth/realms/demo",
    //   redirectUri: process.env.NEXTAUTH_URL + "/api/auth/callback/keycloak"
    // })
    {
      id: "oidc",
      name: "OIDC",
      type: "oauth",
      wellKnown: "http://10.1.1.10:8082/realms/demo/.well-known/openid-configuration",
      clientId: "posoidc",
      clientSecret: "2mkposoidc",
      authorization: { params: { scope: "openid profile email" } },
      checks: ["pkce", "state"], // Security checks
      redirectUri: "http://localhost:3000/api/auth/callback/oidc",
      profile: async (profile, account, user) => { // The profile callback
        try {
          console.log("Keycloak Profile:", profile); // Log the profile (for debugging)
          console.log("Keycloak Account:", account); // Log the account (for debugging)
          console.log("Keycloak User:", user); // Log the user (for debugging)

          return {
            id: profile.sub, // Important: Include the user ID
            name: profile.name,
            email: profile.email,
            image: profile.picture, // Or whatever profile picture field Keycloak provides
            ...profile, // Include other profile properties if needed
          };
        } catch (error) {
          console.error("Keycloak Profile Error:", error); // Log the error
          return Promise.reject(new Error("Keycloak Profile Error")); // Reject the promise
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("OIDC account", account);
      console.log("OIDC token", token);
      if (account) {
        console.log("OIDC account", account);
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("OIDC session", session);
      console.log("OIDC account", token);
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // 🔹 Use environment variables
  debug: true, // ✅ Enable debugging
};

const handler = NextAuth(authOptions);

// ✅ Explicitly export `GET` and `POST` for Next.js App Router
export const GET = handler;
export const POST = handler;