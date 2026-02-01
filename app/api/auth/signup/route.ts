import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  school: z.string().optional(),
  role: z.string().optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  const env = getEnv();

  if (env.ALLOWED_EMAIL_DOMAINS) {
    const allowed = env.ALLOWED_EMAIL_DOMAINS.split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.length) {
      const domain = email.split("@")[1] || "";
      if (!allowed.includes(domain)) {
        return NextResponse.json({ error: "Email domain not allowed" }, { status: 403 });
      }
    }
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      school: parsed.data.school,
      role: parsed.data.role || "STUDENT",
      passwordHash,
    },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ ok: true, user });
}
