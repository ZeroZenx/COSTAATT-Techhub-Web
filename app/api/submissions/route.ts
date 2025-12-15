import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(submissions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const submission = await prisma.submission.create({
      data: body,
    })
    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}

