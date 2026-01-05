import { createAuthClient } from "better-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/config";
import { adminClient, magicLinkClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";

export const authClient = createAuthClient({
  plugins: [adminClient(), passkeyClient(), magicLinkClient()],
});

export const signInWithGithub = async () => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: DEFAULT_LOGIN_REDIRECT,
  });
};

export const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: DEFAULT_LOGIN_REDIRECT,
  });
};

export const signInWithPasskey = async () => {
  try {
    const result = await authClient.signIn.passkey();
    if (result) {
      window.location.href = DEFAULT_LOGIN_REDIRECT;
    }
    return result;
  } catch (error) {
    console.error("Passkey sign in failed:", error);
    throw error;
  }
};

export const signInWithMagicLink = async (email: string) => {
  return await authClient.signIn.magicLink({
    email,
    callbackURL: DEFAULT_LOGIN_REDIRECT,
  });
};

export const signInWithTikTok = async () => {
  await authClient.signIn.social({
    provider: "tiktok",
    callbackURL: DEFAULT_LOGIN_REDIRECT,
  });
};

export const signInWithAuth0 = async () => {
  await authClient.signIn.social({
    provider: "auth0",
    callbackURL: DEFAULT_LOGIN_REDIRECT,
  });
};
