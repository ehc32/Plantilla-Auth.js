"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { ActionResult } from "@/lib/schemas";

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ActionResult<{ user: { id: string; email: string }; twoFactorRedirect?: boolean }>> {
  try {
    const response = await auth.api.signInEmail({ body: { email, password } });

    // Check if 2FA is required
    if ("twoFactorRedirect" in response && response.twoFactorRedirect) {
      return {
        success: { reason: "2FA verification required" },
        error: null,
        data: { twoFactorRedirect: true, user: { id: "", email } },
      };
    }

    return {
      success: { reason: "Login successful" },
      error: null,
      data: undefined,
    };
  } catch (err) {
    if (err instanceof APIError) {
      return {
        error: { reason: err.message },
        success: null,
      };
    }

    return { error: { reason: "Something went wrong." }, success: null };
  }
}
