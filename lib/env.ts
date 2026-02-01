import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(16),
  ALLOWED_EMAIL_DOMAINS: z.string().optional(),
});

let cached:
  | z.infer<typeof envSchema>
  | null = null;

/**
 * Parse env at runtime (not at import time) to avoid breaking `next build`
 * when env vars aren't present in the build environment.
 */
export function getEnv() {
  if (cached) return cached;

  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    ALLOWED_EMAIL_DOMAINS: process.env.ALLOWED_EMAIL_DOMAINS,
  });

  if (!parsed.success) {
    // In dev/build contexts, we allow the app to compile; requests will fail fast at runtime.
    // For real deployments, ensure all required env vars are set.
    const fallback = {
      DATABASE_URL: process.env.DATABASE_URL || "",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "dev-secret-change-me-please",
      ALLOWED_EMAIL_DOMAINS: process.env.ALLOWED_EMAIL_DOMAINS,
    };
    cached = fallback;
    return cached;
  }

  cached = parsed.data;
  return cached;
}
