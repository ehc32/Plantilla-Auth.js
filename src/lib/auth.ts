import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { betterAuth } from "better-auth";
import { admin, magicLink, twoFactor } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  appName: "Better Auth Starter",
  trustedOrigins: ["https://plantilla-auth-js.vercel.app"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.user,
    },
  }),
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    tiktok: {
      clientKey: process.env.TIKTOK_CLIENT_KEY as string,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET as string,
      scope: ["user.info.basic"],
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    passkey(),
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await sendEmail({
          to: email,
          subject: "Sign in with Magic Link",
          text: `Click the link to sign in: ${url}`,
        });
      },
    }),
    twoFactor({
      issuer: "Better Auth Starter",
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendEmail({
            to: user.email,
            subject: "Your 2FA Code",
            text: `Your verification code is: ${otp}. This code will expire in 3 minutes.`,
          });
        },
      },
    }),
  ],
});
